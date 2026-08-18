const RECENT_KEY = "rl:recent";
const MAX = 8;

export interface RecentCreator {
  id: string;
  username: string;
  name: string;
  avatar?: string | null;
  viewedAt: number;
}

export function getRecentlyViewed(): RecentCreator[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addRecentlyViewed(creator: RecentCreator): void {
  const recent = getRecentlyViewed().filter((r) => r.id !== creator.id);
  recent.unshift({ ...creator, viewedAt: Date.now() });
  window.localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, MAX)));
}

export function clearRecentlyViewed(): void {
  window.localStorage.removeItem(RECENT_KEY);
}
