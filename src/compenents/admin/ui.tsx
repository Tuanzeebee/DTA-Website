import type { ReactNode } from "react";

/** Tiny shared pieces for the admin ops pages. */

export const INPUT =
  "w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/60";

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-wider text-white/60 font-bold mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

const CHIP_TONE = {
  green: "bg-emerald-500/15 text-emerald-300",
  amber: "bg-amber-500/15 text-amber-300",
  red: "bg-red-500/15 text-red-300",
  slate: "bg-white/10 text-white/60",
  cyan: "bg-cyan-500/15 text-cyan-300",
} as const;

export function StatusChip({
  tone,
  children,
}: {
  tone: keyof typeof CHIP_TONE;
  children: ReactNode;
}) {
  return (
    <span
      className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider whitespace-nowrap ${CHIP_TONE[tone]}`}
    >
      {children}
    </span>
  );
}

export function PageHeader({
  title,
  desc,
  actions,
}: {
  title: string;
  desc?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start gap-3">
      <div className="mr-auto">
        <h1 className="text-xl font-black text-white">{title}</h1>
        {desc && (
          <p className="mt-1 text-xs text-white/50 max-w-2xl leading-relaxed">
            {desc}
          </p>
        )}
      </div>
      {actions}
    </div>
  );
}

export const PRIMARY_BTN =
  "flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold text-primary-foreground hover:opacity-90 transition-all cursor-pointer";
export const GHOST_BTN =
  "flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-[11px] font-bold text-white/60 hover:text-white transition-colors cursor-pointer";
export const ICON_BTN =
  "p-1.5 rounded-lg border border-white/10 text-white/50 transition-colors cursor-pointer";
export const PRIMARY_STYLE = {
  background: "var(--gradient-primary)",
  boxShadow: "var(--shadow-glow)",
} as const;

export const TH =
  "px-4 py-3 font-bold text-[10px] uppercase tracking-wider text-white/50 text-left";
