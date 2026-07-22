import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ChevronRight, Building, Plus, Phone } from "lucide-react";
import { navItems } from "@/data";
import type { Lang } from "@/types";
import { resolveHref } from "@/lib/nav";

export function MobileNavSheet({
  open,
  onClose,
  lang,
  isLoggedIn,
}: {
  open: boolean;
  onClose: () => void;
  lang: Lang;
  isLoggedIn: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-nav-sheet"
          role="dialog"
          aria-modal="true"
          aria-label={lang === "vn" ? "Điều hướng" : "Navigation"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
          /* top-16 clears the header bar; dvh (not vh) so iOS Safari's
             collapsing address bar cannot cut off the CTA at the bottom. */
          className="lg:hidden fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col bg-[oklch(0.09_0.05_265_/_0.96)] backdrop-blur-2xl overflow-y-auto overscroll-contain"
        >
          <nav className="flex flex-col px-5 pt-4 pb-8 gap-1">
            {navItems.map((n, i) => {
              const isPageRoute = n.href.startsWith("/");
              const targetHref = resolveHref(n.href);

              const inner = (
                <span className="flex items-center justify-between w-full">
                  <span>{n.label[lang]}</span>
                  <ChevronRight className="w-4 h-4 text-accent/60 shrink-0" />
                </span>
              );

              // min-h-14: every row clears the 44px touch-target floor.
              const rowClasses =
                "w-full min-h-14 flex items-center px-4 rounded-xl text-[15px] font-bold text-white border border-transparent hover:border-cyan-400/30 hover:bg-white/5 active:scale-[0.98] transition-all duration-200 cursor-pointer";

              return (
                <motion.div
                  key={n.href}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: reduce ? 0 : 0.04 + i * 0.04,
                    ease: [0.32, 0.72, 0, 1],
                  }}
                >
                  {isPageRoute ? (
                    <Link
                      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                      to={n.href as any}
                      onClick={onClose}
                      className={rowClasses}
                    >
                      {inner}
                    </Link>
                  ) : (
                    <a
                      href={targetHref}
                      onClick={onClose}
                      className={rowClasses}
                    >
                      {inner}
                    </a>
                  )}
                </motion.div>
              );
            })}
          </nav>

          {/* CTA pinned to the end of the sheet, full-width so the label can
              never wrap the way a cramped header pill would. */}
          <div className="mt-auto px-5 pb-8 pt-4 border-t border-white/10">
            <Link
              to="/portal"
              onClick={onClose}
              className="w-full min-h-13 px-6 rounded-full font-bold text-sm text-primary-foreground active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              style={{
                background: "var(--gradient-primary)",
                boxShadow: "var(--shadow-glow)",
              }}
            >
              {isLoggedIn ? (
                <>
                  <Building className="w-4 h-4" />
                  <span>
                    {lang === "vn" ? "Văn phòng số" : "Digital Office"}
                  </span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>{lang === "vn" ? "Gia nhập DTA" : "Join DTA"}</span>
                </>
              )}
            </Link>

            <a
              href="tel:+842363888299"
              className="mt-3 w-full min-h-11 rounded-full border border-white/15 text-xs font-bold text-white/80 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-accent" />
              <span>+84 (0236) 3888-299</span>
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
