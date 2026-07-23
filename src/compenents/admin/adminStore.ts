import { useCallback, useSyncExternalStore } from "react";
import {
  allArticles,
  portalArticles,
  ADMIN_ARTICLES_KEY,
  ADMIN_HIDDEN_KEY,
  type PortalArticle,
} from "@/newsData";

/**
 * Admin-side mutations over the article overlay in localStorage (see the
 * store block in newsData.ts for the merge semantics). Every write fires
 * CHANGE_EVENT so admin views re-render; portal pages pick changes up on
 * their next render since the helpers read through the same merge.
 * Swapping this for a real API later only touches this file.
 */

const CHANGE_EVENT = "dta-admin-articles-changed";

const readJson = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);
    return (parsed ?? fallback) as T;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full/blocked — the change simply doesn't persist */
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

const isBaseId = (id: string) => portalArticles.some((a) => a.id === id);

/** Create or update. Same id = override (mock rows included). */
export function saveArticle(article: PortalArticle) {
  const overrides = readJson<PortalArticle[]>(ADMIN_ARTICLES_KEY, []);
  const next = overrides.filter((o) => o.id !== article.id);
  next.push(article);
  writeJson(ADMIN_ARTICLES_KEY, next);
}

/** Delete: admin-created rows are removed outright; mock rows can't be
 *  removed from the bundle, so they go on the hidden list instead. */
export function deleteArticle(id: string) {
  const overrides = readJson<PortalArticle[]>(ADMIN_ARTICLES_KEY, []);
  writeJson(
    ADMIN_ARTICLES_KEY,
    overrides.filter((o) => o.id !== id),
  );
  if (isBaseId(id)) {
    const hidden = readJson<string[]>(ADMIN_HIDDEN_KEY, []);
    if (!hidden.includes(id)) writeJson(ADMIN_HIDDEN_KEY, [...hidden, id]);
  }
}

/** Drop every local change and return to the bundled mock data. */
export function resetToMockData() {
  try {
    localStorage.removeItem(ADMIN_ARTICLES_KEY);
    localStorage.removeItem(ADMIN_HIDDEN_KEY);
  } catch {
    /* nothing to clear */
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export const newArticleId = () =>
  `adm-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

/** Where a row lives — the table shows this so editors know what a delete
 *  actually does. */
export const articleOrigin = (id: string): "mock" | "admin" =>
  isBaseId(id) ? "mock" : "admin";

const subscribe = (cb: () => void) => {
  window.addEventListener(CHANGE_EVENT, cb);
  // Cross-tab: storage events fire in OTHER tabs.
  const onStorage = (e: StorageEvent) => {
    if (e.key === ADMIN_ARTICLES_KEY || e.key === ADMIN_HIDDEN_KEY) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
};

/** Reactive full list (drafts included) for admin views. allArticles() is
 *  raw-string-memoised, so the snapshot is referentially stable. */
export function useAdminArticles() {
  return useSyncExternalStore(subscribe, allArticles, allArticles);
}

/* ---------------- demo session gate ---------------- */

const AUTH_KEY = "dta-admin-auth";
const AUTH_EVENT = "dta-admin-auth-changed";
/** Mock credential until a real backend exists. */
export const DEMO_PASSWORD = "admin";

const authSubscribe = (cb: () => void) => {
  window.addEventListener(AUTH_EVENT, cb);
  return () => window.removeEventListener(AUTH_EVENT, cb);
};
const authSnapshot = () => {
  try {
    return sessionStorage.getItem(AUTH_KEY) === "1";
  } catch {
    return false;
  }
};

export function useAdminAuth() {
  const isAuthed = useSyncExternalStore(
    authSubscribe,
    authSnapshot,
    () => false,
  );

  const login = useCallback((password: string) => {
    if (password !== DEMO_PASSWORD) return false;
    try {
      sessionStorage.setItem(AUTH_KEY, "1");
    } catch {
      /* session-only fallback: still signal success */
    }
    window.dispatchEvent(new Event(AUTH_EVENT));
    return true;
  }, []);

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(AUTH_KEY);
    } catch {
      /* nothing to clear */
    }
    window.dispatchEvent(new Event(AUTH_EVENT));
  }, []);

  return { isAuthed, login, logout };
}
