import type { ScrapeResult } from "./types";

const TIMEOUT = 8000;

function timeoutFetch(url: string, init?: RequestInit) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT);
  return fetch(url, { ...init, signal: ctrl.signal }).finally(() => clearTimeout(t));
}

function parseInvite(url: string): string | null {
  try {
    const u = new URL(url);
    if (!u.hostname.includes("discord.gg") && !u.hostname.includes("discord.com")) return null;
    if (u.hostname.includes("discord.gg")) return u.pathname.split("/").filter(Boolean)[0] ?? null;
    const m = url.match(/discord\.com\/invite\/([^\/\?]+)/);
    if (m) return m[1];
    return null;
  } catch {
    return null;
  }
}

export async function scrapeDiscord(url: string): Promise<ScrapeResult> {
  const code = parseInvite(url);
  if (!code) return { platform: "discord", error: "رابط ديسكورد غير صالح" };
  const res = await timeoutFetch(
    `https://discord.com/api/v10/invites/${encodeURIComponent(code)}?with_counts=true&with_expiration=true`
  );
  if (!res.ok) return { platform: "discord", handle: code, error: `Discord ${res.status}` };
  const data = await res.json() as {
    code: string;
    guild?: { name: string; icon?: string };
    approximate_member_count?: number;
    approximate_presence_count?: number;
  };
  return {
    platform: "discord",
    handle: code,
    bio: data.guild?.name,
    followerCount: data.approximate_member_count,
    views: data.approximate_presence_count,
  };
}
