import { useState } from "react";
import { toast } from "sonner";
import { CreditCard, CheckCircle2, AlertCircle } from "lucide-react";
import type { Lang } from "@/types";

/**
 * "Hội phí" — chỉ theo dõi nộp hội phí của chính hội viên.
 * ẨN theo yêu cầu 09/2026: Sổ quỹ công khai / Giám sát thu chi công khai
 * (giữ code cũ dưới dạng comment để khôi phục khi cần).
 */
export function FinancePanel({ lang }: { lang: Lang }) {
  const [paid, setPaid] = useState(false);

  // ẨN 09/2026: const ledger: { label: string; value: string; tone: string }[] = [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-white/8">
        <span className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
          <CreditCard className="w-4 h-4 text-cyan-300" />
        </span>
        <div>
          <h4 className="display text-base font-black text-white">
            {lang === "vn" ? "Hội phí" : "Membership Fee"}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            {lang === "vn"
              ? "Theo dõi nộp hội phí của đơn vị mình."
              : "Track your own organization's fee payments."}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-1 gap-5 max-w-xl">
        {/* Own fee status */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 flex flex-col">
          <h5 className="text-[11px] font-black text-white uppercase tracking-[0.18em] mb-5">
            {lang === "vn" ? "Hội phí thường niên của tôi" : "My Annual Fee"}
          </h5>
          <p className="text-xs text-muted-foreground leading-relaxed -mt-2 mb-4">
            {lang === "vn"
              ? "Hội viên tổ chức: tùy quy mô, từ 3 đến 5.000.000 VNĐ/năm. Mọi thu chi được công khai, báo cáo minh bạch tại các phiên họp toàn thể."
              : "Corporate members: 3 to 5,000,000 VND/year depending on scale. All income and spending is reported at plenary meetings."}
          </p>

          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider block">
                {lang === "vn" ? "Niên khóa 2026" : "Term 2026"}
              </span>
              <span className="font-mono text-3xl font-black text-white mt-1.5 block tracking-tight">
                3–5
                <span className="text-sm font-bold text-muted-foreground ml-1.5">
                  triệu VNĐ
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

        {/* ẨN theo yêu cầu 09/2026: Sổ quỹ công khai / Giám sát thu chi công khai.
            Giữ code để khôi phục: khối Public ledger + nút Tải sao kê (PDF) đã ẩn.
        */}
      </div>
    </div>
  );
}
