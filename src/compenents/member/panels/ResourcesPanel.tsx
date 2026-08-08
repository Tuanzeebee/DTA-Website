import { toast } from "sonner";
import {
  FileText,
  Download,
  FileBarChart,
  Scale,
  BookOpen,
} from "lucide-react";
import type { Lang } from "@/types";

/**
 * "Ấn phẩm & Tài nguyên" — internal documents as a list of rows, not cramped
 * cards: type icon, title, meta, download action. One row per document scans
 * like a library catalogue.
 */
export function ResourcesPanel({ lang }: { lang: Lang }) {
  const files = [
    {
      icon: FileBarChart,
      title:
        lang === "vn"
          ? "Ấn phẩm Toàn cảnh CNTT & Vi mạch Đà Nẵng 2026"
          : "Danang Semiconductor & IT Landscape Report 2026",
      size: "12.4 MB",
      type: lang === "vn" ? "Báo cáo PDF" : "PDF Report",
    },
    {
      icon: Scale,
      title:
        lang === "vn"
          ? "Nghị quyết số 02/2026/NQ-HĐND về cơ chế ưu đãi Vi mạch bán dẫn"
          : "Decree No.02/2026/NQ-HDND on Semiconductor Incentives",
      size: "2.1 MB",
      type: lang === "vn" ? "Văn bản pháp quy" : "Government Bill",
    },
    {
      icon: BookOpen,
      title:
        lang === "vn"
          ? "Cẩm nang Đăng ký Sở hữu trí tuệ phần mềm quốc tế"
          : "Manual for Software IP Registries & Patents in USA/EU",
      size: "4.8 MB",
      type: lang === "vn" ? "Cẩm nang pháp lý" : "Legal Manual",
    },
  ];

  const handleDownload = () => {
    toast.loading(
      lang === "vn" ? "Đang tải tệp tin nội bộ..." : "Downloading file...",
    );
    setTimeout(() => {
      toast.dismiss();
      toast.success(
        lang === "vn" ? "Tải xuống hoàn tất!" : "Download complete!",
      );
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-white/8">
        <span className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
          <FileText className="w-4 h-4 text-cyan-300" />
        </span>
        <div>
          <h4 className="display text-base font-black text-white">
            {lang === "vn"
              ? "Ấn phẩm & Tài nguyên lưu hành nội bộ"
              : "Library & Internal Publications"}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            {lang === "vn"
              ? "Dành riêng cho Hội viên — phân tích thị trường, nghiên cứu vi mạch, nghị quyết đặc thù."
              : "Members only — market analyses, microelectronics studies, local decrees."}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/[0.02] divide-y divide-white/6 overflow-hidden">
        {files.map((file, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors group"
          >
            <span className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
              <file.icon className="w-4.5 h-4.5 text-accent" />
            </span>
            <div className="min-w-0 flex-1">
              <h5 className="text-sm font-bold text-white leading-snug truncate">
                {file.title}
              </h5>
              <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-2">
                <span className="uppercase tracking-wider font-bold text-accent/80">
                  {file.type}
                </span>
                <span aria-hidden>·</span>
                <span className="font-mono">{file.size}</span>
              </p>
            </div>
            <button
              onClick={handleDownload}
              className="shrink-0 px-4 h-9 rounded-lg text-[11px] font-extrabold uppercase tracking-wider bg-accent/10 text-accent hover:bg-accent/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {lang === "vn" ? "Tải xuống" : "Download"}
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
