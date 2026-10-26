import { MapPin, Phone, Mail } from "lucide-react";
import type { Lang } from "@/types";
import logoDta from "@/assets/Logo1.webp";

export function Footer({ lang }: { lang: Lang }) {
  return (
    <footer className="border-t border-white/10 py-16 px-6 bg-black/40">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10 text-xs text-muted-foreground">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 font-black tracking-widest mb-4 text-white">
            {/* Same association logo as the header (Nav). */}
            <img
              src={logoDta}
              alt="DTA Logo"
              className="h-10 w-auto object-contain shrink-0"
            />
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-wider leading-none">
                DTA DANANG
              </span>
              <span className="text-[8px] font-semibold text-muted-foreground mt-0.5 uppercase tracking-normal">
                {lang === "vn"
                  ? "Hiệp hội Công nghệ số Đà Nẵng"
                  : "Danang Digital Technology Association"}
              </span>
            </div>
          </div>
          <p className="text-muted-foreground max-w-sm leading-relaxed mb-4">
            {lang === "vn"
              ? "DTA là tổ chức xã hội - nghề nghiệp tự nguyện đại diện tiếng nói của hàng trăm tổ chức, chuyên gia công nghệ số Đà Nẵng."
              : "DTA is a voluntary social-professional association representing hundreds of digital technology enterprises and specialists in Danang City."}
          </p>
          <p className="text-[10px] font-medium text-muted-foreground/60">
            © 2026 Danang Digital Technology Association (DTA). All rights
            reserved.
          </p>
        </div>

        <div>
          <div className="font-bold text-white uppercase tracking-wider mb-3">
            {lang === "vn" ? "Liên hệ Trụ sở" : "Contact HQ"}
          </div>
          <ul className="space-y-3 text-[11px]">
            <li className="flex items-start gap-1.5 leading-tight">
              <MapPin className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
              <span>
                Tầng 2, số 15 Quang Trung, Khu Công viên Phần mềm, phường Hải
                Châu, TP. Đà Nẵng
              </span>
            </li>
            <li className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-accent shrink-0" />
              <a href="tel:0903501320" className="hover:text-white transition-colors">
                0903 501 320 (ĐT-Zalo)
              </a>
            </li>
            <li className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-accent shrink-0" />
              <a
                href="mailto:office@dtadanang.org.vn"
                className="hover:text-white transition-colors"
              >
                office@dtadanang.org.vn
              </a>
            </li>
          </ul>
        </div>

        <div>
          <div className="font-bold text-white uppercase tracking-wider mb-3">
            {lang === "vn" ? "Cơ quan Quản lý" : "Regulatory Bodies"}
          </div>
          <ul className="space-y-2 text-[11px] leading-relaxed">
            <li>
              •{" "}
              {lang === "vn"
                ? "Ủy ban Nhân dân TP. Đà Nẵng"
                : "People's Committee of Danang City"}
            </li>
            <li>
              •{" "}
              {lang === "vn"
                ? "Sở Nội vụ thành phố"
                : "Department of Home Affairs"}
            </li>
            <li>
              •{" "}
              {lang === "vn"
                ? "Sở Khoa học và Công nghệ"
                : "Department of Science & Technology"}
            </li>
          </ul>
        </div>
      </div>

      {/* Thông tin giấy phép Trang TTĐT tổng hợp (bắt buộc theo giấy phép). */}
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-white/10 text-[11px] text-muted-foreground leading-relaxed space-y-1">
        <p>
          {lang === "vn"
            ? "Cung cấp thông tin lên Internet theo Giấy phép Thiết lập Trang Thông tin điện tử tổng hợp số 1337, ngày 07 tháng 08 năm 2026 của Sở Văn hóa – Thể thao và Du lịch thành phố Đà Nẵng."
            : "Information provided on the Internet under General Website License No. 1337, issued 07 August 2026 by the Danang Department of Culture, Sports and Tourism."}
        </p>
        <p>
          <span className="font-bold text-white/80">
            {lang === "vn" ? "Chịu trách nhiệm: " : "Responsible: "}
          </span>
          {lang === "vn"
            ? "Ông Phạm Kim Sơn – Chủ tịch Hiệp hội DTA; Nhà báo Trần Ngọc – Thư ký tòa soạn DTA.VN"
            : "Mr. Pham Kim Son – Chairman of DTA; Journalist Tran Ngoc – Managing Editor of DTA.VN"}
        </p>
      </div>
    </footer>
  );
}
