import type { ScrapeResult } from "./types";

const TIMEOUT = 8000;

function timeoutFetch(url: string, init?: RequestInit) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT);
  return fetch(url, { ...init, signal: ctrl.signal }).finally(() => clearTimeout(t));
}

export async function scrapeOEmbed(url: string, platform: string): Promise<ScrapeResult> {
  let endpoint: string | null = null;
  if (platform === "tiktok") endpoint = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
  else if (platform === "instagram") {
    const token = process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET
      ? `${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`
      : null;
    if (!token) return { platform, error: "oEmbed يحتاج FACEBOOK_APP_ID/SECRET" };
    endpoint = `https://graph.facebook.com/v22.0/instagram_oembed?url=${encodeURIComponent(url)}&access_token=${encodeURIComponent(token)}`;
  } else if (platform === "x") endpoint = `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}`;
  else return { platform, error: "oEmbed غير مدعوم لهذه المنصة" };

  try {
    const res = await timeoutFetch(endpoint);
    if (!res.ok) return { platform, error: `oEmbed ${res.status}` };
    const data = await res.json() as { title?: string; author_name?: string; thumbnail_url?: string; html?: string };
    return {
      platform,
      handle: data.author_name,
      bio: data.title?.slice(0, 300),
      avatar: data.thumbnail_url,
    };
  } catch (e) {
    return { platform, error: e instanceof Error ? e.message : "oEmbed فشل" };
  }
}
