import { Link } from "@tanstack/react-router";
import { ArrowLeft, Globe } from "lucide-react";
import { useLang } from "@/hooks/useLang";
import { useScrolled } from "@/hooks/useScrolled";

/**
 * Shared fixed header for every member-portal page (/portal, /portal/dang-ky).
 *
 * Deliberately quieter than the landing Nav: the portal is a workspace, so the
 * chrome recedes — logo, a way back to the public site, and the locale toggle.
 * The bar is transparent over the hero glow and condenses into glass once the
 * page scrolls (same language as the main Nav).
 */
export function PortalHeader() {
  const { lang, toggleLang } = useLang();
  const scrolled = useScrolled();

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass border-b"
          : "bg-transparent border-b border-transparent shadow-none"
      }`}
    >
      <div
        className={`w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-4 transition-all duration-300 ${
          scrolled ? "h-12" : "h-16"
        }`}
      >
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0 cursor-pointer -ml-1 sm:-ml-2"
          aria-label="DTA — Trang chủ"
        >
          <img
            src="https://dsa.org.vn/wp-content/uploads/2017/11/logoSVG_1411.svg"
            alt="DTA Logo"
            className={`transition-all duration-300 w-auto object-contain ${
              scrolled ? "h-8 md:h-9" : "h-10 md:h-12"
            }`}
            referrerPolicy="no-referrer"
          />
          <span className="hidden sm:block leading-tight">
            <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-white/90">
              DTA Member Portal
            </span>
            <span className="block text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              {lang === "vn" ? "Văn phòng số" : "Digital Office"}
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2.5 whitespace-nowrap flex-nowrap shrink-0">
          <Link
            to="/"
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white hover:text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer border border-white/20 whitespace-nowrap"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">
              {lang === "vn" ? "Trở về Trang chủ" : "Back to Home"}
            </span>
            <span className="sm:hidden">
              {lang === "vn" ? "Trang chủ" : "Home"}
            </span>
          </Link>

          <button
            onClick={toggleLang}
            aria-label={
              lang === "vn" ? "Chuyển sang tiếng Anh" : "Switch to Vietnamese"
            }
            className="px-2.5 py-1.5 rounded-xl text-[10px] font-bold text-white border border-white/20 hover:border-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 active:scale-95 transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <Globe className="w-3 h-3 text-cyan-400" />
            <span>{lang === "vn" ? "EN" : "VN"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
