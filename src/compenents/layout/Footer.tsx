import { MapPin, Phone, Mail } from "lucide-react";
import type { Lang } from "@/types";

export function Footer({ lang }: { lang: Lang }) {
  return (
    <footer className="border-t border-white/10 py-16 px-6 bg-black/40">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10 text-xs text-muted-foreground">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 font-black tracking-widest mb-4 text-white">
            <span
              className="inline-block w-8 h-8 rounded-md flex items-center justify-center text-[10px] text-white font-black"
              style={{ background: "var(--gradient-primary)" }}
            >
              DTA
            </span>
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
                Tầng 4, Tòa nhà Công Viên Phần Mềm, 02 Quang Trung, Hải Châu,
                TP. Đà Nẵng
              </span>
            </li>
            <li className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-accent shrink-0" />
              <span>+84 (0236) 3888-299</span>
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
                ? "Sở Thông tin và Truyền thông"
                : "Department of Information & Communications"}
            </li>
            <li>
              •{" "}
              {lang === "vn"
                ? "Sở Khoa học và Công nghệ"
                : "Department of Science & Technology"}
            </li>
            <li>
              •{" "}
              {lang === "vn"
                ? "Sở Nội vụ thành phố"
                : "Department of Home Affairs"}
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
