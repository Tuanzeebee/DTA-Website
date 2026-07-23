import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { toast } from "sonner";
import type { Lang } from "@/types";

const LANG_KEY = "dta_lang";
const LOGIN_KEY = "dta_is_logged_in";

function isLang(value: string | null): value is Lang {
  return value === "vn" || value === "en";
}

/* Locale is a GLOBAL store, not per-component state: the portal chrome
   (menu bar, sidebar blocks, cards) reads the locale directly instead of
   prop-drilling, so every subscriber must flip together when the header
   toggle fires. */
const langListeners = new Set<() => void>();
let langCache: Lang = "vn";
let langInitialized = false;

const readLang = (): Lang => {
  if (!langInitialized) {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (isLang(saved)) langCache = saved;
    } catch {
      /* storage unavailable -> default vn */
    }
    langInitialized = true;
  }
  return langCache;
};

const writeLang = (next: Lang) => {
  langCache = next;
  langInitialized = true;
  try {
    localStorage.setItem(LANG_KEY, next);
  } catch {
    /* session-only */
  }
  langListeners.forEach((l) => l());
};

const subscribeLang = (cb: () => void) => {
  langListeners.add(cb);
  return () => {
    langListeners.delete(cb);
  };
};

/**
 * Locale state persisted to localStorage and shared across the whole tree —
 * any component may call useLang() and it stays in sync with the header
 * toggle.
 */
export function useLang() {
  const lang = useSyncExternalStore(
    subscribeLang,
    readLang,
    () => "vn" as Lang,
  );

  const changeLang = useCallback((next: Lang) => writeLang(next), []);

  /** Flip locale and announce it — the shared behaviour behind every EN/VN button. */
  const toggleLang = useCallback(() => {
    const next: Lang = readLang() === "vn" ? "en" : "vn";
    writeLang(next);
    toast.info(
      next === "vn" ? "Đã chuyển sang tiếng Việt" : "Switched to English",
    );
  }, []);

  return { lang, setLang: changeLang, toggleLang };
}

/**
 * Demo session flag persisted to localStorage.
 *
 * This is a front-end-only mock, not authentication — it gates which portal
 * view renders and nothing more.
 */
export function useSession(lang: Lang) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem(LOGIN_KEY) === "true");
  }, []);

  const handleLogin = useCallback(
    (status: boolean) => {
      setIsLoggedIn(status);
      if (status) {
        localStorage.setItem(LOGIN_KEY, "true");
        toast.success(
          lang === "vn"
            ? "Đăng nhập Cổng Hội viên DTA thành công!"
            : "Successfully logged into DTA Member Portal!",
        );
      } else {
        localStorage.removeItem(LOGIN_KEY);
        toast.success(
          lang === "vn"
            ? "Đã đăng xuất khỏi hệ thống."
            : "Successfully logged out.",
        );
      }
    },
    [lang],
  );

  return { isLoggedIn, handleLogin };
}
