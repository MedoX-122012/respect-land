import type { ScrapeResult, VideoInfo } from "./types";

const TIMEOUT = 8000;
let cachedToken: { token: string; expiresAt: number } | null = null;

function timeoutFetch(url: string, init?: RequestInit) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT);
  return fetch(url, { ...init, signal: ctrl.signal }).finally(() => clearTimeout(t));
}

async function getAppToken(): Promise<string | null> {
  const id = process.env.TWITCH_CLIENT_ID?.trim();
  const secret = process.env.TWITCH_CLIENT_SECRET?.trim();
  if (!id || !secret) return null;
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60000) return cachedToken.token;
  const res = await timeoutFetch(`https://id.twitch.tv/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `client_id=${encodeURIComponent(id)}&client_secret=${encodeURIComponent(secret)}&grant_type=client_credentials`,
  });
  if (!res.ok) return null;
  const data = await res.json() as { access_token: string; expires_in: number };
  cachedToken = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return data.access_token;
}

function parseLogin(url: string): string | null {
  try {
    const u = new URL(url);
    if (!u.hostname.includes("twitch.tv")) return null;
    return u.pathname.split("/").filter(Boolean)[0] ?? null;
  } catch {
    return null;
  }
}

export async function scrapeTwitch(url: string): Promise<ScrapeResult> {
  const login = parseLogin(url);
  if (!login) return { platform: "twitch", error: "رابط تويتش غير صالح" };
  const token = await getAppToken();
  if (!token) return { platform: "twitch", handle: login, error: "TWITCH_CLIENT_ID/SECRET غير مضبوط" };
  const clientId = process.env.TWITCH_CLIENT_ID!.trim();
  const headers = { "Client-Id": clientId, Authorization: `Bearer ${token}` };

  const userRes = await timeoutFetch(`https://api.twitch.tv/helix/users?login=${encodeURIComponent(login)}`, { headers });
  if (!userRes.ok) return { platform: "twitch", error: `Twitch users ${userRes.status}` };
  const userData = await userRes.json() as { data: Array<{ id: string; login: string; display_name: string; description: string; profile_image_url: string; view_count: number }> };
  const user = userData.data?.[0];
  if (!user) return { platform: "twitch", error: "القناة غير موجودة" };

  const vRes = await timeoutFetch(`https://api.twitch.tv/helix/videos?user_id=${user.id}&first=12&sort=time&type=archive`, { headers });
  let videos: VideoInfo[] = [];
  if (vRes.ok) {
    const vData = await vRes.json() as { data: Array<{ id: string; title: string; thumbnail_url: string; url: string; view_count: number; created_at: string }> };
    videos = (vData.data ?? []).map((v) => ({
      externalId: v.id,
      title: v.title,
      thumbnail: v.thumbnail_url?.replace("%{width}", "320").replace("%{height}", "180"),
      url: v.url,
      views: v.view_count,
      platform: "twitch",
      publishedAt: v.created_at,
    }));
  }

  const followersRes = await timeoutFetch(`https://api.twitch.tv/helix/channels/followers?broadcaster_id=${user.id}`, { headers });
  let followerCount: number | undefined;
  if (followersRes.ok) {
    const fData = await followersRes.json() as { total: number };
    followerCount = fData.total;
  }

  const sortedByViews = [...videos].sort((a, b) => (b.views ?? 0) - (a.views ?? 0));

  return {
    platform: "twitch",
    handle: login,
    avatar: user.profile_image_url,
    bio: user.description?.slice(0, 300),
    followerCount,
    views: user.view_count,
    latestVideo: videos[0],
    topViewed: sortedByViews[0],
    topLiked: sortedByViews[0],
    videos,
  };
}
