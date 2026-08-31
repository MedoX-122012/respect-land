import type { ScrapeResult } from "./types";
import { scrapeYouTube } from "./youtube";
import { scrapeTwitch } from "./twitch";
import { scrapeKick } from "./kick";
import { scrapeDiscord } from "./discord";
import { scrapeOEmbed } from "./oembed";

const ALLOWED_HOSTS = [
  "youtube.com",
  "youtu.be",
  "twitch.tv",
  "kick.com",
  "discord.gg",
  "discord.com",
  "tiktok.com",
  "instagram.com",
  "x.com",
  "twitter.com",
];

export function detectPlatform(url: string): string | null {
  try {
    const h = new URL(url).hostname.toLowerCase();
    if (h.includes("youtube.com") || h.includes("youtu.be")) return "youtube";
    if (h.includes("twitch.tv")) return "twitch";
    if (h.includes("kick.com")) return "kick";
    if (h.includes("discord.gg") || h.includes("discord.com")) return "discord";
    if (h.includes("tiktok.com")) return "tiktok";
    if (h.includes("instagram.com")) return "instagram";
    if (h.includes("x.com") || h.includes("twitter.com")) return "x";
    return null;
  } catch {
    return null;
  }
}

export function isAllowedUrl(url: string): boolean {
  try {
    const h = new URL(url).hostname.toLowerCase();
    return ALLOWED_HOSTS.some((d) => h === d || h.endsWith(`.${d}`));
  } catch {
    return false;
  }
}

export async function scrapeByPlatform(platform: string, url: string): Promise<ScrapeResult> {
  switch (platform) {
    case "youtube":
      return scrapeYouTube(url);
    case "twitch":
      return scrapeTwitch(url);
    case "kick":
      return scrapeKick(url);
    case "discord":
      return scrapeDiscord(url);
    case "tiktok":
    case "instagram":
    case "x":
      return scrapeOEmbed(url, platform);
    default:
      return { platform, error: "منصة غير مدعومة" };
  }
}

export async function scrapeUrl(url: string): Promise<ScrapeResult> {
  const platform = detectPlatform(url);
  if (!platform) return { platform: "unknown", error: "رابط غير مدعوم" };
  return scrapeByPlatform(platform, url);
}
