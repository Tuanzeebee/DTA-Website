import { ShieldCheck } from "lucide-react";
import type { Lang } from "@/types";

/**
 * The portal's signature object: the digital member card ("thẻ hội viên số")
 * the charter promises every approved organisation.
 *
 * A bronze-foil rim wraps a deep-moss face etched with a concentric Đông Sơn
 * pattern; a fixed deterministic dot-matrix stands in for the QR that the
 * physical card will carry. Everything decorative is aria-hidden.
 */

/* 7x7 deterministic "QR" pattern — reads as a scannable mark without
   pretending to encode anything. */
const QR_PATTERN = [
  "#######",
  "#.....#",
  "#.###.#",
  "#.#..##",
  "#.###.#",
  "#.....#",
  "####.##",
] as const;

export function MemberCard({
  lang,
  companyName,
  representative,
  memberId,
}: {
  lang: Lang;
  companyName: string;
  representative: string;
  memberId: string;
}) {
  return (
    /* Bronze foil rim: 1px gradient border drawn as a padded wrapper — same
       technique as .card-prism, but free-standing so the card can sit anywhere. */
    <div className="relative rounded-2xl p-px bg-[linear-gradient(115deg,oklch(0.85_0.14_75_/_0.7),oklch(0.68_0.14_58_/_0.25)_45%,oklch(0.85_0.14_75_/_0.55))] shadow-[0_20px_50px_-20px_oklch(0.78_0.12_78_/_0.35)]">
      <div className="relative overflow-hidden rounded-[calc(1rem-1px)] bg-[linear-gradient(135deg,oklch(0.20_0.05_160),oklch(0.13_0.03_158)_60%,oklch(0.17_0.05_80))] px-5 py-4 sm:px-6 sm:py-5">
        {/* Etched concentric rings, top-right — the drum, abstracted. */}
        <div
          aria-hidden
          className="absolute -right-14 -top-16 w-52 h-52 rounded-full border border-accent/15"
        >
          <div className="absolute inset-4 rounded-full border border-dashed border-accent/20" />
          <div className="absolute inset-9 rounded-full border border-accent/10" />
          <div className="absolute inset-14 rounded-full bg-accent/[0.06]" />
        </div>
        {/* Sheen across the face. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.97_0.02_155_/_0.07),transparent_35%)]"
        />

        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-accent">
                {lang === "vn" ? "Thẻ Hội viên số" : "Digital Member Card"}
              </span>
            </div>
            <div className="mt-3 font-mono text-lg sm:text-xl font-bold tracking-[0.14em] text-white">
              {memberId}
            </div>
            <div className="mt-3 space-y-0.5">
              <p className="text-sm font-bold text-white truncate">
                {companyName}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {lang === "vn" ? "Đại diện" : "Representative"}:{" "}
                {representative}
              </p>
            </div>
          </div>

          {/* QR stand-in */}
          <div
            aria-hidden
            className="shrink-0 rounded-lg bg-white/[0.92] p-1.5 grid grid-cols-7 gap-px"
          >
            {QR_PATTERN.flatMap((row, y) =>
              row
                .split("")
                .map((cell, x) => (
                  <span
                    key={`${y}-${x}`}
                    className={`w-[5px] h-[5px] rounded-[1px] ${
                      cell === "#"
                        ? "bg-[oklch(0.18_0.04_160)]"
                        : "bg-transparent"
                    }`}
                  />
                )),
            )}
          </div>
        </div>

        <div className="relative mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] uppercase tracking-wider">
          <span className="font-bold text-emerald-400">
            {lang === "vn" ? "Hội viên Tổ chức" : "Corporate Member"}
          </span>
          <span className="text-muted-foreground font-mono">
            {lang === "vn" ? "Niên khóa 2026" : "Term 2026"}
          </span>
        </div>
      </div>
    </div>
  );
}
