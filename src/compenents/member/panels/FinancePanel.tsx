import { useState } from "react";
import { toast } from "sonner";
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileDown,
} from "lucide-react";
import type { Lang } from "@/types";

/**
 * "Hội phí & Tài chính" — the member's own fee status next to the
 * association's public ledger. Big mono numerals: money should read at a
 * glance, not hide in 10px prose.
 */
export function FinancePanel({ lang }: { lang: Lang }) {
  const [paid, setPaid] = useState(false);

  const ledger = [
    {
      label: lang === "vn" ? "Tổng quỹ thu tích lũy" : "Accumulated revenue",
      value: "145.000.000",
      tone: "text-white",
    },
    {
      label:
        lang === "vn" ? "Tổng chi hoạt động (XTTM, Đào tạo)" : "Total expenses",
      value: "-112.000.000",
      tone: "text-rose-400",
    },
    {
      label: lang === "vn" ? "Dư quỹ hiện tại" : "Current balance",
      value: "33.000.000",
      tone: "text-emerald-400",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-white/8">
        <span className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
          <CreditCard className="w-4 h-4 text-cyan-300" />
        </span>
        <div>
          <h4 className="display text-base font-black text-white">
            {lang === "vn"
              ? "Hội phí & Báo cáo Thu chi công khai"
              : "Fees & Transparent Ledger"}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            {lang === "vn"
              ? "Minh bạch tuyệt đối — mọi khoản thu chi đều để Hội viên giám sát."
              : "Total clarity — every transaction is open to member oversight."}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Own fee status */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 flex flex-col">
          <h5 className="text-[11px] font-black text-white uppercase tracking-[0.18em] mb-5">
            {lang === "vn" ? "Hội phí thường niên của tôi" : "My Annual Fee"}
          </h5>

          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider block">
                {lang === "vn" ? "Niên khóa 2026" : "Term 2026"}
              </span>
              <span className="font-mono text-3xl font-black text-white mt-1.5 block tracking-tight">
                5.000.000
                <span className="text-sm font-bold text-muted-foreground ml-1.5">
                  VNĐ
                </span>
              </span>
            </div>
            {paid ? (
              <span className="px-3 py-1.5 bg-emerald-500/15 text-emerald-400 text-[11px] font-black uppercase tracking-wider rounded-lg flex items-center gap-1.5 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {lang === "vn" ? "Đã nộp" : "Paid"}
              </span>
            ) : (
              <span className="px-3 py-1.5 bg-rose-500/15 text-rose-400 text-[11px] font-black uppercase tracking-wider rounded-lg flex items-center gap-1.5 shrink-0">
                <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
                {lang === "vn" ? "Chưa nộp" : "Unpaid"}
              </span>
            )}
          </div>

          <div className="mt-auto pt-6">
            {!paid && (
              <button
                onClick={() => {
                  setPaid(true);
                  toast.success(
                    lang === "vn"
                      ? "Hệ thống đã ghi nhận thanh toán hội phí niên khóa 2026!"
                      : "Annual membership fee payment recorded!",
                  );
                }}
                className="w-full h-11 rounded-xl font-bold text-sm text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                style={{
                  background: "var(--gradient-primary)",
                  boxShadow: "var(--shadow-glow)",
                }}
              >
                <CreditCard className="w-4 h-4" />
                {lang === "vn"
                  ? "Thanh toán trực tuyến (mô phỏng)"
                  : "Pay Online (Simulated)"}
              </button>
            )}
          </div>
        </div>

        {/* Public ledger */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 flex flex-col">
          <h5 className="text-[11px] font-black text-white uppercase tracking-[0.18em] mb-5 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            {lang === "vn" ? "Sổ quỹ công khai" : "Public Fund Ledger"}
          </h5>

          <div className="space-y-3 flex-1">
            {ledger.map((row, i) => (
              <div
                key={row.label}
                className={`flex items-baseline justify-between gap-4 ${
                  i === ledger.length - 1 ? "pt-3 border-t border-white/10" : ""
                }`}
              >
                <span className="text-xs text-muted-foreground">
                  {row.label}
                </span>
                <span
                  className={`font-mono font-bold whitespace-nowrap ${row.tone} ${
                    i === ledger.length - 1 ? "text-lg" : "text-sm"
                  }`}
                >
                  {row.value}{" "}
                  <span className="text-[10px] text-muted-foreground">VNĐ</span>
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              toast.info(
                lang === "vn"
                  ? "Đang xuất sao kê tài chính chi tiết..."
                  : "Exporting financial sheet...",
              );
              setTimeout(() => {
                toast.success(
                  lang === "vn"
                    ? "Xuất sao kê PDF thành công!"
                    : "PDF sheet exported successfully!",
                );
              }, 1200);
            }}
            className="w-full mt-6 h-10 border border-white/10 rounded-xl text-[11px] text-white uppercase font-bold tracking-wider hover:bg-white/5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" />
            {lang === "vn"
              ? "Tải sao kê chi tiết (PDF)"
              : "Download Audit Sheet"}
          </button>
        </div>
      </div>
    </div>
  );
}
