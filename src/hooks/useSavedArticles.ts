import { useCallback, useSyncExternalStore } from "react";

/**
 * "Lưu bài" reader utility (per the association's brief) — bookmarks live in
 * localStorage until real user accounts exist. useSyncExternalStore keeps
 * every subscriber (utility bars, the /news/da-luu page, the menu badge) in
 * sync when any of them toggles a bookmark, including across tabs via the
 * native "storage" event.
 */
const KEY = "dta-saved-articles";

const listeners = new Set<() => void>();
let cache: string[] = [];
let cacheRaw: string | null = null;

const read = (): string[] => {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return cache;
  }
  if (raw === cacheRaw) return cache; // stable ref for useSyncExternalStore
  cacheRaw = raw;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cache = Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string")
      : [];
  } catch {
    cache = [];
  }
  return cache;
};

const write = (ids: string[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* storage full/blocked — bookmark just doesn't persist */
  }
  listeners.forEach((l) => l());
};

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  // Cross-tab sync: the storage event only fires in OTHER tabs.
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
};

export function useSavedArticles() {
  const saved = useSyncExternalStore(subscribe, read, () => cache);

  const toggle = useCallback((id: string) => {
    const current = read();
    write(
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
    );
  }, []);

  const isSaved = useCallback((id: string) => saved.includes(id), [saved]);

  return { saved, isSaved, toggle };
}
