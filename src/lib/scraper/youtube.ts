import type { ScrapeResult, VideoInfo } from "./types";

const YT_API = "https://www.googleapis.com/youtube/v3";
const TIMEOUT = 8000;

function timeoutFetch(url: string, init?: RequestInit) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT);
  return fetch(url, { ...init, signal: ctrl.signal }).finally(() => clearTimeout(t));
}

function parseHandle(url: string): string | null {
  try {
    const u = new URL(url);
    if (!u.hostname.includes("youtube.com") && !u.hostname.includes("youtu.be")) return null;
    const m =
      url.match(/youtube\.com\/@([^\/\?]+)/) ||
      url.match(/youtube\.com\/c\/([^\/\?]+)/) ||
      url.match(/youtube\.com\/channel\/([^\/\?]+)/) ||
      url.match(/youtube\.com\/user\/([^\/\?]+)/);
    if (m) return m[1];
    if (u.pathname.startsWith("/@")) return u.pathname.slice(2).split("/")[0];
    return null;
  } catch {
    return null;
  }
}

function parseChannelId(url: string): string | null {
  const m = url.match(/youtube\.com\/channel\/([^\/\?]+)/);
  return m ? m[1] : null;
}

export async function scrapeYouTube(url: string): Promise<ScrapeResult> {
  const apiKey = process.env.YOUTUBE_API_KEY?.trim();
  if (!apiKey) return { platform: "youtube", error: "YOUTUBE_API_KEY غير مضبوط" };

  const channelIdFromUrl = parseChannelId(url);
  let channelId = channelIdFromUrl;
  let handle = parseHandle(url);

  if (!channelId && handle) {
    const res = await timeoutFetch(
      `${YT_API}/channels?part=id&forHandle=${encodeURIComponent(handle)}&key=${apiKey}`
    );
    if (!res.ok) return { platform: "youtube", error: `YouTube API ${res.status}` };
    const data = await res.json();
    if (data.items?.[0]?.id) channelId = data.items[0].id;
    else {
      const searchRes = await timeoutFetch(
        `${YT_API}/search?part=snippet&type=channel&q=${encodeURIComponent(handle)}&maxResults=1&key=${apiKey}`
      );
      if (searchRes.ok) {
        const sData = await searchRes.json();
        channelId = sData.items?.[0]?.id?.channelId ?? null;
      }
    }
  }

  if (!channelId) return { platform: "youtube", handle: handle ?? undefined, error: "تعذر تحديد القناة" };

  const chRes = await timeoutFetch(
    `${YT_API}/channels?part=snippet,statistics,contentDetails&id=${channelId}&key=${apiKey}`
  );
  if (!chRes.ok) return { platform: "youtube", error: `channels ${chRes.status}` };
  const chData = await chRes.json();
  const ch = chData.items?.[0];
  if (!ch) return { platform: "youtube", error: "القناة غير موجودة" };

  const uploadsId: string | undefined = ch.contentDetails?.relatedPlaylists?.uploads;
  let videos: VideoInfo[] = [];

  if (uploadsId) {
    const plRes = await timeoutFetch(
      `${YT_API}/playlistItems?part=contentDetails&playlistId=${uploadsId}&maxResults=12&key=${apiKey}`
    );
    if (plRes.ok) {
      const plData = await plRes.json();
      const ids: string[] = (plData.items ?? []).map((it: { contentDetails: { videoId: string } }) => it.contentDetails.videoId).filter(Boolean);
      if (ids.length) {
        const vRes = await timeoutFetch(
          `${YT_API}/videos?part=snippet,statistics&id=${ids.join(",")}&key=${apiKey}`
        );
        if (vRes.ok) {
          const vData = await vRes.json();
          videos = (vData.items ?? []).map((v: {
            id: string;
            snippet: { title: string; thumbnails: { medium?: { url: string }; high?: { url: string } }; publishedAt: string };
            statistics: { viewCount?: string; likeCount?: string; commentCount?: string };
          }) => ({
            externalId: v.id,
            title: v.snippet.title,
            thumbnail: v.snippet.thumbnails?.medium?.url ?? v.snippet.thumbnails?.high?.url,
            url: `https://www.youtube.com/watch?v=${v.id}`,
            views: v.statistics.viewCount ? parseInt(v.statistics.viewCount, 10) : undefined,
            likes: v.statistics.likeCount ? parseInt(v.statistics.likeCount, 10) : undefined,
            comments: v.statistics.commentCount ? parseInt(v.statistics.commentCount, 10) : undefined,
            publishedAt: v.snippet.publishedAt,
            platform: "youtube",
          }));
        }
      }
    }
  }

  const sortedByViews = [...videos].sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
  const sortedByLikes = [...videos].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
  const sortedByDate = [...videos].sort((a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime());

  return {
    platform: "youtube",
    handle: ch.snippet.customUrl ?? handle ?? undefined,
    channelId,
    avatar: ch.snippet.thumbnails?.medium?.url ?? ch.snippet.thumbnails?.high?.url,
    bio: ch.snippet.description?.slice(0, 300),
    followerCount: ch.statistics.subscriberCount ? parseInt(ch.statistics.subscriberCount, 10) : undefined,
    views: ch.statistics.viewCount ? parseInt(ch.statistics.viewCount, 10) : undefined,
    videoCount: ch.statistics.videoCount ? parseInt(ch.statistics.videoCount, 10) : undefined,
    latestVideo: sortedByDate[0],
    topViewed: sortedByViews[0],
    topLiked: sortedByLikes[0],
    videos,
  };
}
