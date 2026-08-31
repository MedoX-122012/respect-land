import type { ScrapeResult, VideoInfo } from "./types";

const TIMEOUT = 8000;

function timeoutFetch(url: string, init?: RequestInit) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT);
  return fetch(url, { ...init, signal: ctrl.signal }).finally(() => clearTimeout(t));
}

function parseSlug(url: string): string | null {
  try {
    const u = new URL(url);
    if (!u.hostname.includes("kick.com")) return null;
    return u.pathname.split("/").filter(Boolean)[0] ?? null;
  } catch {
    return null;
  }
}

export async function scrapeKick(url: string): Promise<ScrapeResult> {
  const slug = parseSlug(url);
  if (!slug) return { platform: "kick", error: "رابط كيك غير صالح" };
  const res = await timeoutFetch(`https://kick.com/api/v2/channels/${encodeURIComponent(slug)}`, {
    headers: { "User-Agent": "RespectLand/1.0", Accept: "application/json" },
  });
  if (!res.ok) return { platform: "kick", handle: slug, error: `Kick ${res.status}` };
  const data = await res.json() as {
    user?: { username: string; profile_pic?: string };
    followers_count?: number;
    followersCount?: number;
    livestream?: { view_count?: number; session_title?: string; thumbnail?: { url?: string }; created_at?: string; id?: number | string };
    channel?: { description?: string };
    banner_image?: { url?: string };
  };
  const followerCount = data.followers_count ?? data.followersCount;
  const livestream = data.livestream;
  let videos: VideoInfo[] = [];
  if (livestream?.id) {
    videos.push({
      externalId: String(livestream.id),
      title: livestream.session_title,
      thumbnail: livestream.thumbnail?.url,
      url: `https://kick.com/${slug}`,
      views: livestream.view_count,
      platform: "kick",
      publishedAt: livestream.created_at,
    });
  }
  return {
    platform: "kick",
    handle: slug,
    avatar: data.user?.profile_pic,
    bio: data.channel?.description?.slice(0, 300),
    followerCount: typeof followerCount === "number" ? followerCount : undefined,
    views: livestream?.view_count,
    latestVideo: videos[0],
    topViewed: videos[0],
    topLiked: videos[0],
    videos,
  };
}
