const FAV_KEY = "rl:favorites";

export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(FAV_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(id);
}

export function toggleFavorite(id: string): boolean {
  const favs = getFavorites();
  const exists = favs.includes(id);
  const next = exists ? favs.filter((f) => f !== id) : [...favs, id];
  window.localStorage.setItem(FAV_KEY, JSON.stringify(next));
  return !exists;
}

export function onFavoritesChange(cb: () => void): () => void {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}
