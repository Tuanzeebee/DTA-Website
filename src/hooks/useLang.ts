import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { Lang } from "@/types";

const LANG_KEY = "dta_lang";
const LOGIN_KEY = "dta_is_logged_in";

function isLang(value: string | null): value is Lang {
  return value === "vn" || value === "en";
}

/**
 * Locale state persisted to localStorage.
 *
 * Reads on mount rather than in the initialiser so the hook stays safe if the
 * app is ever server-rendered — localStorage does not exist during SSR.
 * This logic was previously copy-pasted into index, news, and portal.
 */
export function useLang() {
  const [lang, setLang] = useState<Lang>("vn");

  useEffect(() => {
    const saved = localStorage.getItem(LANG_KEY);
    if (isLang(saved)) setLang(saved);
  }, []);

  const changeLang = useCallback((next: Lang) => {
    setLang(next);
    localStorage.setItem(LANG_KEY, next);
  }, []);

  /** Flip locale and announce it — the shared behaviour behind every EN/VN button. */
  const toggleLang = useCallback(() => {
    setLang((current) => {
      const next: Lang = current === "vn" ? "en" : "vn";
      localStorage.setItem(LANG_KEY, next);
      toast.info(
        next === "vn" ? "Đã chuyển sang tiếng Việt" : "Switched to English",
      );
      return next;
    });
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
