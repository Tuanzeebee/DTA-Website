import { motion } from "motion/react";
import { toast } from "sonner";
import { Download } from "lucide-react";
import type { Lang } from "@/types";

interface CharterModalProps {
  lang: Lang;
  onClose: () => void;
}

export function CharterModal({ lang, onClose }: CharterModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark overlay backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* Dialog body */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        className="relative w-full max-w-4xl max-h-[85dvh] overflow-hidden glass rounded-3xl border border-white/15 flex flex-col shadow-2xl z-10"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5 shrink-0">
          <div>
            <span className="text-[10px] font-black uppercase text-accent tracking-widest">
              {lang === "vn"
                ? "Văn bản minh bạch công khai"
                : "Transparent Official Bill"}
            </span>
            <h3 className="text-lg font-black text-white uppercase tracking-wide mt-1">
              {lang === "vn"
                ? "Điều lệ Hiệp hội (Dự thảo)"
                : "DTA Official Association Charter (Draft)"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/5 active:scale-90 transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-sm text-muted-foreground leading-relaxed font-sans max-h-[60dvh]">
          <div className="text-center pb-4 border-b border-white/5">
            <h4 className="text-white font-extrabold text-base uppercase leading-tight">
              {lang === "vn"
                ? "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM"
                : "SOCIALIST REPUBLIC OF VIETNAM"}
            </h4>
            <p className="text-white font-bold text-xs mt-1">
              {lang === "vn"
                ? "Độc lập - Tự do - Hạnh phúc"
                : "Independence - Freedom - Happiness"}
            </p>
            <p className="text-[10px] text-muted-foreground/80 mt-2 font-mono">
              {lang === "vn"
                ? "Ban Chấp hành lâm thời DTA · Niên khóa 2025-2026"
                : "DTA Executive Committee · Period 2025-2026"}
            </p>
          </div>

          {/* Chapter 1 */}
          <div className="space-y-2">
            <h5 className="font-black text-white text-xs uppercase tracking-wider">
              {lang === "vn"
                ? "CHƯƠNG I: TÔN CHỈ, MỤC ĐÍCH & TƯ CÁCH PHÁP NHÂN"
                : "CHAPTER I: OBJECTIVES AND LEGAL CAPACITY"}
            </h5>
            <p>
              <strong>
                {lang === "vn"
                  ? "Điều 1: Tên gọi"
                  : "Article 1: Official Naming"}
              </strong>
              <br />-{" "}
              {lang === "vn"
                ? "Tên tiếng Việt: Hiệp hội Công nghệ số thành phố Đà Nẵng (viết tắt là DTA Đà Nẵng)."
                : "Vietnamese Name: Hiệp hội Công nghệ số thành phố Đà Nẵng (DTA Danang)."}
              <br />-{" "}
              {lang === "vn"
                ? "Tên tiếng Anh: Danang Digital Technology Association (viết tắt là DTA)."
                : "English Name: Danang Digital Technology Association (DTA)."}
            </p>
            <p>
              <strong>
                {lang === "vn"
                  ? "Điều 2: Tính chất và mục đích"
                  : "Article 2: Mission Statement"}
              </strong>
              <br />-{" "}
              {lang === "vn"
                ? "DTA là tổ chức xã hội - nghề nghiệp tự nguyện, phi lợi nhuận, đại diện cho lợi ích chung của các tổ chức, cá nhân thiết kế vi mạch bán dẫn, lập trình AI, hạ tầng an ninh thông tin mạng tại Đà Nẵng."
                : "DTA is a voluntary, non-profit social-professional organization representing technology designers, chip engineers, and smart city architects."}
            </p>
          </div>

          {/* Chapter 2 */}
          <div className="space-y-2">
            <h5 className="font-black text-white text-xs uppercase tracking-wider">
              {lang === "vn"
                ? "CHƯƠNG II: TIÊU CHUẨN VÀ THẨM TRA HỘI VIÊN"
                : "CHAPTER II: MEMBERSHIP AUDITING PROCESS"}
            </h5>
            <p>
              <strong>
                {lang === "vn"
                  ? "Điều 5: Thủ tục đăng ký gia nhập số hóa"
                  : "Article 5: Digital Application Requirements"}
              </strong>
              <br />-{" "}
              {lang === "vn"
                ? "Cá nhân, tổ chức tự nguyện khai báo hồ sơ năng lực trực tuyến qua Văn phòng số. Văn phòng thực hiện thẩm tra tư cách pháp lý trong vòng tối đa 30 ngày làm việc."
                : "All applicants register online through our Digital Office. The secretariat reviews profiles within 30 business days."}
            </p>
            <p>
              <strong>
                {lang === "vn"
                  ? "Điều 6: Quyền lợi của hội viên"
                  : "Article 6: Core Privileges"}
              </strong>
              <br />-{" "}
              {lang === "vn"
                ? "Được quyền bỏ phiếu biểu quyết dân chủ, đề cử nhân sự vào Ban Chấp hành; được bảo vệ pháp lý bản quyền phần mềm, kết nối cung cầu thương mại, và truy cập tài nguyên nội bộ."
                : "Members hold democratic voting rights, legal defense for software copyright patents, trade promotion resources, and access to internal tech libraries."}
            </p>
          </div>

          {/* Chapter 3 */}
          <div className="space-y-2">
            <h5 className="font-black text-white text-xs uppercase tracking-wider">
              {lang === "vn"
                ? "CHƯƠNG III: NGUYÊN TẮC TÀI CHÍNH VÀ MINH BẠCH"
                : "CHAPTER III: FINANCIAL TRANSPARENCY & AUDITING"}
            </h5>
            <p>
              <strong>
                {lang === "vn"
                  ? "Điều 10: Quản lý Quỹ Hội phi lợi nhuận"
                  : "Article 10: Non-profit Accounting Rules"}
              </strong>
              <br />-{" "}
              {lang === "vn"
                ? "Mọi nguồn thu từ Hội phí thường niên (5.000.000 VNĐ đối với tổ chức) và tài trợ hợp pháp đều được sử dụng 100% cho mục tiêu đào tạo, xúc tiến thương mại số."
                : "All member fees (5,000,000 VND for corporate entities) and sponsorships are channeled directly back into technology R&D programs."}
              <br />-{" "}
              {lang === "vn"
                ? "Hệ thống số tự động công khai dòng tiền (Thu/Chi/Tồn) chi tiết hàng tháng trên Cổng Hội viên số để đảm bảo tính dân chủ, không một cá nhân nào được trục lợi."
                : "DTA Digital Office logs complete financial ledgers dynamically every month for complete democratic monitoring."}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-white/5 flex flex-wrap gap-3 justify-end shrink-0">
          <button
            onClick={() => {
              toast.success(
                lang === "vn"
                  ? "Đang tải văn bản Điều lệ chính thức..."
                  : "Downloading official PDF charter...",
              );
            }}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-accent text-primary-foreground hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>
              {lang === "vn"
                ? "Tải bản dự thảo chính thức (PDF)"
                : "Download Official Charter"}
            </span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold border border-white/10 hover:bg-white/5 text-white active:scale-95 transition-all cursor-pointer"
          >
            {lang === "vn" ? "Đóng lại" : "Close"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
