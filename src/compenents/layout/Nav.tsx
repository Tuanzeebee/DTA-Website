import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Globe, Building } from "lucide-react";
import { navItems } from "@/data";
import type { Lang } from "@/types";
import { useScrolled } from "@/hooks/useScrolled";
import { resolveHref } from "@/lib/nav";
import { MobileNavSheet } from "./MobileNavSheet";

export interface NavProps {
  lang: Lang;
  toggleLang: () => void;
  isLoggedIn: boolean;
}

export function Nav({ lang, toggleLang, isLoggedIn }: NavProps) {
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);

  // While the sheet is open: lock background scroll and allow Escape to close.
  // The previous overflow value is restored rather than hard-set to "", so we
  // don't clobber a lock owned by something else (e.g. the charter modal).
  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  // A resize past the lg breakpoint must dismiss the sheet, otherwise the
  // desktop nav and the mobile overlay are both mounted and the scroll lock
  // stays applied to a page that no longer has a way to release it.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMenuOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? "glass border-b"
          : "bg-transparent border-b border-transparent shadow-none"
      }`}
    >
      <div
        className={`w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-4 transition-all duration-300 flex-nowrap ${
          /* Mobile height stays fixed at h-16 so it always matches the sheet's
             top-16 offset; shrinking it would open a gap under the header
             while the menu is up. Desktop still condenses on scroll. */
          scrolled ? "h-16 lg:h-12" : "h-16"
        }`}
      >
        <a
          href={
            typeof window !== "undefined" && window.location.pathname !== "/"
              ? "/#top"
              : "#top"
          }
          className="flex items-center gap-2 shrink-0 cursor-pointer -ml-1 sm:-ml-2"
        >
          <img
            src="https://dsa.org.vn/wp-content/uploads/2017/11/logoSVG_1411.svg"
            alt="DTA Logo"
            className={`transition-all duration-300 w-auto object-contain ${
              scrolled ? "h-8 md:h-9" : "h-10 md:h-12"
            }`}
            referrerPolicy="no-referrer"
          />
        </a>

        <nav className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-white whitespace-nowrap flex-nowrap shrink-0 font-['Be_Vietnam_Pro']">
          {navItems.map((n) => {
            const isPageRoute = n.href.startsWith("/");
            const targetHref = resolveHref(n.href);

            const linkClasses =
              "text-white font-bold hover:text-cyan-300 hover:scale-105 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.85)] transition-all duration-200 cursor-pointer whitespace-nowrap font-['Be_Vietnam_Pro'] relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-cyan-400 after:transition-all after:duration-300 hover:after:w-full";

            return isPageRoute ? (
              <Link
                key={n.href}
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                to={n.href as any}
                className={linkClasses}
              >
                {n.label[lang]}
              </Link>
            ) : (
              <a key={n.href} href={targetHref} className={linkClasses}>
                {n.label[lang]}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 shrink-0 whitespace-nowrap flex-nowrap font-['Be_Vietnam_Pro']">
          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            /* min-h-9 / min-w-11: below lg this is a real touch target rather
               than the 20px-tall pill it used to be. */
            className="px-2.5 min-h-9 lg:min-h-0 lg:py-1 rounded-md text-[10px] font-bold text-white border border-white/20 hover:border-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0 whitespace-nowrap font-['Be_Vietnam_Pro']"
            id="lang-toggle-btn"
            aria-label={
              lang === "vn" ? "Chuyển sang tiếng Anh" : "Switch to Vietnamese"
            }
          >
            <Globe className="w-3 h-3 text-cyan-400" />
            <span>{lang === "vn" ? "EN" : "VN"}</span>
          </button>

          {/* Primary CTA. Hidden below lg — at 375px it competes with the logo
              and the menu trigger; the sheet carries it full-width instead. */}
          {isLoggedIn ? (
            <Link
              to="/portal"
              className="hidden lg:flex px-4 py-1.5 rounded-full text-xs font-bold text-primary-foreground items-center gap-1.5 transition-all duration-300 cursor-pointer whitespace-nowrap shrink-0"
              style={{
                background: "var(--gradient-primary)",
                boxShadow: "var(--shadow-glow)",
              }}
            >
              <Building className="w-3.5 h-3.5" />
              <span>{lang === "vn" ? "Văn phòng số" : "Digital Office"}</span>
            </Link>
          ) : (
            <Link
              to="/portal"
              className="hidden lg:block px-4 py-1.5 rounded-full text-xs font-bold text-primary-foreground hover:opacity-90 active:scale-95 transition-all duration-300 cursor-pointer whitespace-nowrap shrink-0"
              style={{
                background: "var(--gradient-primary)",
                boxShadow: "var(--shadow-glow)",
              }}
            >
              {lang === "vn" ? "Gia nhập DTA" : "Join DTA"}
            </Link>
          )}

          {/* Menu trigger — the two bars rotate into an X rather than swapping
              glyphs, so the control reads as one continuous object. */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-sheet"
            aria-label={
              menuOpen
                ? lang === "vn"
                  ? "Đóng menu"
                  : "Close menu"
                : lang === "vn"
                  ? "Mở menu"
                  : "Open menu"
            }
            className="lg:hidden relative w-11 h-11 -mr-1 shrink-0 rounded-xl border border-white/15 hover:border-cyan-400/50 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          >
            <span
              aria-hidden
              className={`absolute block h-[1.5px] w-[18px] bg-white transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                menuOpen ? "rotate-45" : "-translate-y-[3.5px]"
              }`}
            />
            <span
              aria-hidden
              className={`absolute block h-[1.5px] w-[18px] bg-white transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                menuOpen ? "-rotate-45" : "translate-y-[3.5px]"
              }`}
            />
          </button>
        </div>
      </div>

      <MobileNavSheet
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        lang={lang}
        isLoggedIn={isLoggedIn}
      />
    </header>
  );
}

/**
 * Full-height navigation sheet for < lg.
 *
 * Sits below the header in the stacking order so the logo and the morphing
 * trigger stay visible and interactive while it is open — closing does not
 * require hunting for a separate X.
 */
