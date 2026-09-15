import { Link } from "@tanstack/react-router";
import { ArrowLeft, Globe } from "lucide-react";
import { useLang } from "@/hooks/useLang";
import { useScrolled } from "@/hooks/useScrolled";
import logoDta from "@/assets/Logo1.png";

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
          ? "glass-white border-b border-gray-200"
          : "bg-white border-b border-gray-100 shadow-none"
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
            src={logoDta}
            alt="DTA Logo"
            className={`transition-all duration-300 w-auto object-contain mix-blend-multiply ${
              scrolled ? "h-10 md:h-11" : "h-12 md:h-14"
            }`}
          />
          <span className="hidden sm:block leading-tight">
            <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-gray-900">
              DTA Member Portal
            </span>
            <span className="block text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              {lang === "vn" ? "Không gian số" : "Member Space"}
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2.5 whitespace-nowrap flex-nowrap shrink-0">
          <Link
            to="/"
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-gray-700 hover:text-green-600 hover:bg-green-50 hover:border-green-500 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer border border-gray-300 whitespace-nowrap"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-green-500" />
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
            className="px-2.5 py-1.5 rounded-xl text-[10px] font-bold text-gray-700 border border-gray-300 hover:border-green-500 hover:text-green-600 hover:bg-green-50 active:scale-95 transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <Globe className="w-3 h-3 text-green-500" />
            <span>{lang === "vn" ? "EN" : "VN"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
