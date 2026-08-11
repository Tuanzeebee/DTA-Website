import { Link } from "@tanstack/react-router";
import { Globe, Home, Newspaper } from "lucide-react";
import { useLang } from "@/hooks/useLang";
import { PageShell } from "@/compenents/layout/PageShell";
import { TrongDongDisc } from "@/compenents/TrongDongDisc";
import { ScrollReveal } from "@/compenents/ScrollReveal";
import logoDta from "@/assets/logoDTA.webp";

/**
 * Immersive standalone 404 — handles BOTH unmatched URLs and the
 * `throw notFound()` raised by /news/article/$id, /news/$topic and
 * /news/$topic/$category (they all bubble to the root notFoundComponent).
 *
 * Deliberately free of the site chrome (Nav/Footer): a dead end should be a
 * single calm scene, not a broken-looking page. The persistent escape routes
 * are the logo, the two CTAs and the language toggle — nothing else competes
 * for attention.
 *
 * The bronze drum turns slowly behind the numerals like an artifact on a
 * museum turntable; reduced-motion and mobile simplifications are handled
 * inside TrongDongDisc and the drum CSS, so this file carries no motion
 * guards of its own.
 */

const strings = {
  eyebrow: {
    vn: "MÃ LỖI 404 · KHÔNG TÌM THẤY TRANG",
    en: "ERROR 404 · PAGE NOT FOUND",
  },
  title: {
    vn: "Trang không tồn tại hoặc đã được di chuyển",
    en: "This page doesn't exist or has been moved",
  },
  desc: {
    vn: "Đường dẫn có thể đã thay đổi, bài viết đã bị gỡ, hoặc địa chỉ bị nhập sai. Hãy quay về trang chủ hoặc khám phá những tin tức mới nhất từ DTA.",
    en: "The link may have changed, the article may have been removed, or the address was mistyped. Head back home or explore the latest stories from DTA.",
  },
  pathLabel: { vn: "Đường dẫn đã truy cập", en: "Requested path" },
  btnHome: { vn: "Về trang chủ", en: "Back to home" },
  btnNews: { vn: "Khám phá DTA News", en: "Explore DTA News" },
} as const;

export function NotFoundPage() {
  const { lang, toggleLang } = useLang();
  /* Client-only SPA: window always exists at render, and the pathname never
     changes while this page is mounted (navigating away unmounts it). */
  const path = window.location.pathname;

  return (
    <PageShell>
      <div className="relative flex min-h-[100dvh] flex-col">
        {/* Minimal chrome: brand anchor on the left, locale toggle on the
            right. The toggle hits the global lang store directly, so it works
            even though this page sits outside the normal route chrome. */}
        <header className="relative z-10 mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            aria-label={lang === "vn" ? "Về trang chủ DTA" : "Back to DTA home"}
            className="-ml-1 flex shrink-0 items-center"
          >
            <img
              src={logoDta}
              alt="DTA Logo"
              className="h-9 w-auto object-contain"
            />
          </Link>
          <button
            onClick={toggleLang}
            id="notfound-lang-toggle"
            aria-label={
              lang === "vn" ? "Chuyển sang tiếng Anh" : "Switch to Vietnamese"
            }
            className="flex min-h-9 shrink-0 cursor-pointer items-center justify-center gap-1 rounded-md border border-white/20 px-2.5 text-[10px] font-bold whitespace-nowrap text-white transition-all hover:border-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 active:scale-95"
          >
            <Globe className="h-3 w-3 text-cyan-400" />
            <span>{lang === "vn" ? "EN" : "VN"}</span>
          </button>
        </header>

        <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-12">
          {/* Backdrop: the same blueprint grid + top spotlight family the
              landing sections use, so the dead end still belongs to the site. */}
          <div aria-hidden className="bg-grid absolute inset-0" />
          <div aria-hidden className="bg-spotlight absolute inset-0" />

          {/* Drum disc behind the numerals. The wrapper owns position/size/
              opacity; TrongDongDisc's own root stays `relative` and fills it. */}
          <div
            aria-hidden
            className="absolute top-1/2 left-1/2 aspect-square w-[min(85vw,540px)] -translate-x-1/2 -translate-y-1/2 opacity-40"
          >
            <TrongDongDisc className="h-full w-full" />
          </div>

          <div className="relative z-10 max-w-2xl text-center">
            <ScrollReveal>
              <p className="text-accent text-[10px] font-bold tracking-[0.25em] uppercase md:text-xs">
                {strings.eyebrow[lang]}
              </p>
            </ScrollReveal>

            {/* The numerals are decorative — the eyebrow and h1 already carry
                the meaning, so screen readers skip the giant glyph. */}
            <ScrollReveal delay={0.08}>
              <p
                aria-hidden
                className="display text-gradient-gold py-2 text-[clamp(6rem,22vw,13rem)] leading-none font-black select-none"
              >
                404
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.16}>
              <h1 className="display py-1 text-2xl leading-[1.35] font-black text-white sm:text-3xl md:text-4xl">
                {strings.title[lang]}
              </h1>
              <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-sm leading-relaxed md:text-base">
                {strings.desc[lang]}
              </p>
            </ScrollReveal>

            {/* The attempted URL: when an editor reports "the link is broken",
                this chip tells us exactly which one. */}
            <ScrollReveal delay={0.24}>
              <p className="mt-6 inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5">
                <span className="shrink-0 text-[9px] font-bold tracking-wider text-white/35 uppercase">
                  {strings.pathLabel[lang]}:
                </span>
                <span className="truncate font-mono text-[11px] text-white/50">
                  {path}
                </span>
              </p>
            </ScrollReveal>

            {/* CTA pair mirrors the Hero: gradient primary + ghost outline.
                Full-width stacked on phones so labels never wrap. */}
            <ScrollReveal delay={0.32}>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                <Link
                  to="/"
                  className="text-primary-foreground flex min-h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-full px-7 text-sm font-bold transition-all duration-300 hover:scale-[1.02] active:scale-95 sm:w-auto"
                  style={{
                    background: "var(--gradient-primary)",
                    boxShadow: "var(--shadow-glow)",
                  }}
                >
                  <Home className="h-4 w-4" />
                  <span>{strings.btnHome[lang]}</span>
                </Link>
                <Link
                  to="/news"
                  className="flex min-h-13 w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-7 text-sm font-bold transition-all duration-300 hover:bg-white/10 active:scale-95 sm:w-auto"
                >
                  <Newspaper className="h-4 w-4 text-white/70" />
                  <span>{strings.btnNews[lang]}</span>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </main>
      </div>
    </PageShell>
  );
}
