import { useSyncExternalStore } from "react";

/**
 * Generic localStorage-backed collection for the admin ops pages (fees,
 * resources, forum queue, applications). Unlike the article/member stores
 * there is no bundled base to overlay — the WHOLE list persists; the seed
 * only shows while nothing is stored. Swapping for a real API later means
 * reimplementing this one factory.
 */

export interface CollectionStore<T extends { id: string }> {
  read: () => T[];
  save: (item: T) => void;
  remove: (id: string) => void;
  reset: () => void;
  /** Reactive list — a React hook (uses useSyncExternalStore). */
  useItems: () => T[];
}

export function createCollectionStore<T extends { id: string }>(
  storageKey: string,
  seed: T[],
): CollectionStore<T> {
  const EVENT = `${storageKey}-changed`;
  let cache: { raw: string | null; items: T[] } = { raw: null, items: seed };
  let cacheInit = false;

  const read = (): T[] => {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(storageKey);
    } catch {
      return cache.items;
    }
    // Raw-string memo keeps the array referentially stable for hooks.
    if (cacheInit && raw === cache.raw) return cache.items;
    let items = seed;
    if (raw) {
      try {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) items = parsed as T[];
      } catch {
        /* corrupted -> seed */
      }
    }
    cache = { raw, items };
    cacheInit = true;
    return items;
  };

  const write = (items: T[]) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      /* storage full/blocked — the change simply doesn't persist */
    }
    window.dispatchEvent(new Event(EVENT));
  };

  const save = (item: T) => {
    const items = read();
    const exists = items.some((x) => x.id === item.id);
    write(
      exists
        ? items.map((x) => (x.id === item.id ? item : x))
        : [...items, item],
    );
  };

  const remove = (id: string) => write(read().filter((x) => x.id !== id));

  const reset = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      /* nothing to clear */
    }
    window.dispatchEvent(new Event(EVENT));
  };

  const subscribe = (cb: () => void) => {
    window.addEventListener(EVENT, cb);
    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKey) cb();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(EVENT, cb);
      window.removeEventListener("storage", onStorage);
    };
  };

  const useItems = () => useSyncExternalStore(subscribe, read, read);

  return { read, save, remove, reset, useItems };
}

export const genId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
