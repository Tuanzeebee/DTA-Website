import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import {
  UserPlus,
  ChevronRight,
  ChevronLeft,
  Check,
  CheckCircle2,
  AlertCircle,
  Building,
  Scale,
  BadgeCheck,
  Clock,
  CreditCard,
  LogIn,
  Upload,
} from "lucide-react";
import { useLang } from "@/hooks/useLang";

/**
 * /portal/dang-ky — standalone membership application.
 *
 * Deliberately OUTSIDE the sign-in wall: a prospective member has no account
 * yet, so enrollment must be reachable by anyone (and shareable by URL). The
 * old flow hid this form behind a demo login — that conflated two audiences.
 */

export const Route = createFileRoute("/portal/dang-ky")({
  component: RegisterPage,
});

const LABEL =
  "block text-[11px] uppercase tracking-wider text-muted-foreground font-bold mb-1.5";

const FIELD =
  "w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent/50 focus:bg-white/[0.06] transition-colors";

function RegisterPage() {
  const { lang } = useLang();
  const [step, setStep] = useState(1);
  const [trackingCode, setTrackingCode] = useState("");
  const [data, setData] = useState({
    orgName: "",
    representative: "",
    email: "",
    techField: "AI",
    hasLegalDoc: false,
  });

  const stepLabels = [
    lang === "vn" ? "Thông tin tổ chức" : "Organization",
    lang === "vn" ? "Pháp lý & Lĩnh vực" : "Legal & Field",
    lang === "vn" ? "Hoàn tất" : "Done",
  ];

  const requireStep1 = (): boolean => {
    if (!data.orgName.trim() || !data.email.trim()) {
      toast.error(
        lang === "vn"
          ? "Vui lòng nhập đầy đủ các trường bắt buộc (*)."
          : "Please fill in all required fields (*).",
      );
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      toast.error(
        lang === "vn"
          ? "Địa chỉ email chưa đúng định dạng."
          : "That email address doesn't look right.",
      );
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!data.hasLegalDoc) {
      toast.error(
        lang === "vn"
          ? "Vui lòng tải lên tài liệu chứng minh tư cách pháp lý."
          : "Please upload your legal status document.",
      );
      return;
    }
    const code = "DTA-" + Math.floor(1000 + Math.random() * 9000);
    setTrackingCode(code);
    setStep(3);
    toast.success(
      lang === "vn"
        ? "Đã nộp đơn gia nhập DTA số hóa thành công!"
        : "DTA digital enrollment submitted!",
    );
  };

  const reset = () => {
    setStep(1);
    setData({
      orgName: "",
      representative: "",
      email: "",
      techField: "AI",
      hasLegalDoc: false,
    });
  };

  return (
    <main className="flex-grow pt-28 md:pt-32 pb-20 px-4 md:px-6 relative">
      <div className="max-w-6xl mx-auto">
        {/* Page heading */}
        <div className="max-w-2xl mb-10">
          <p className="text-[11px] md:text-xs tracking-[0.25em] font-bold text-accent uppercase mb-4 flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            {lang === "vn" ? "Gia nhập Hiệp hội" : "Join the Association"}
          </p>
          <h1 className="display text-3xl sm:text-4xl md:text-5xl font-black leading-[1.25] text-white">
            {lang === "vn" ? "Đăng ký Hội viên" : "Membership"}{" "}
            <span className="text-gradient-gold">
              {lang === "vn" ? "trực tuyến" : "Application"}
            </span>
          </h1>
          <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
            {lang === "vn"
              ? "Số hóa 100% quy trình: nộp hồ sơ, thẩm tra tư cách pháp nhân và phê duyệt theo Điều lệ — tối đa 30 ngày, không cần giấy tờ bản cứng."
              : "A fully digitized pipeline: apply, legal verification and charter approval — within 30 days, no paperwork required."}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Form column */}
          <div className="lg:col-span-7 card-surface rounded-3xl p-6 md:p-8">
            {/* Progress rail */}
            <ol className="flex items-center gap-2 sm:gap-3 mb-8">
              {stepLabels.map((label, i) => {
                const n = i + 1;
                const done = step > n;
                const current = step === n;
                return (
                  <li
                    key={label}
                    className="flex items-center gap-2 sm:gap-3 flex-1 last:flex-none"
                  >
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-all duration-300 ${
                        done
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : current
                            ? "text-accent-foreground"
                            : "bg-white/5 text-muted-foreground border border-white/10"
                      }`}
                      style={
                        current
                          ? {
                              background: "var(--gradient-gold)",
                              boxShadow: "var(--shadow-gold)",
                            }
                          : undefined
                      }
                    >
                      {done ? <Check className="w-4 h-4" /> : n}
                    </span>
                    <span
                      className={`hidden md:block text-[11px] font-bold uppercase tracking-wider whitespace-nowrap ${
                        current
                          ? "text-accent"
                          : done
                            ? "text-emerald-400"
                            : "text-muted-foreground"
                      }`}
                    >
                      {label}
                    </span>
                    {n < stepLabels.length && (
                      <span
                        aria-hidden
                        className={`h-px flex-1 min-w-4 transition-colors duration-500 ${
                          step > n ? "bg-emerald-500/50" : "bg-white/10"
                        }`}
                      />
                    )}
                  </li>
                );
              })}
            </ol>

            <AnimatePresence mode="wait">
              {/* STEP 1 — organization info */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -14 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="space-y-5"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className={LABEL}>
                        {lang === "vn"
                          ? "Tên Cơ quan / Tổ chức nộp đơn *"
                          : "Organization Name *"}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Công ty TNHH SoftTech Đà Nẵng"
                        value={data.orgName}
                        onChange={(e) =>
                          setData({ ...data, orgName: e.target.value })
                        }
                        className={FIELD}
                      />
                    </div>
                    <div>
                      <label className={LABEL}>
                        {lang === "vn"
                          ? "Người đại diện pháp luật"
                          : "Legal Representative"}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Trần Minh Quân"
                        value={data.representative}
                        onChange={(e) =>
                          setData({ ...data, representative: e.target.value })
                        }
                        className={FIELD}
                      />
                    </div>
                    <div>
                      <label className={LABEL}>
                        {lang === "vn"
                          ? "Email liên hệ chính *"
                          : "Primary Email *"}
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. contact@softtech.com"
                        value={data.email}
                        onChange={(e) =>
                          setData({ ...data, email: e.target.value })
                        }
                        className={FIELD}
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end">
                    <button
                      onClick={() => requireStep1() && setStep(2)}
                      className="px-6 h-11 rounded-xl font-bold text-sm text-accent-foreground hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
                      style={{
                        background: "var(--gradient-gold)",
                        boxShadow: "var(--shadow-gold)",
                      }}
                    >
                      {lang === "vn" ? "Tiếp tục" : "Continue"}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2 — legal & field */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -14 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="space-y-5"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={LABEL}>
                        {lang === "vn"
                          ? "Lĩnh vực công nghệ cốt lõi"
                          : "Core Technology Pillar"}
                      </label>
                      <select
                        value={data.techField}
                        onChange={(e) =>
                          setData({ ...data, techField: e.target.value })
                        }
                        className={`${FIELD} cursor-pointer`}
                      >
                        <option value="AI">
                          {lang === "vn" ? "AI & Dữ liệu lớn" : "AI & Big Data"}
                        </option>
                        <option value="semi">
                          {lang === "vn"
                            ? "Vi mạch & Bán dẫn"
                            : "Semiconductors & IC Design"}
                        </option>
                        <option value="cloud">
                          {lang === "vn"
                            ? "Điện toán đám mây"
                            : "Cloud & Blockchain"}
                        </option>
                        <option value="iot">
                          {lang === "vn"
                            ? "Robot & Tự động hóa nhúng"
                            : "Robotics & Automation"}
                        </option>
                      </select>
                    </div>
                    <div>
                      <label className={LABEL}>
                        {lang === "vn"
                          ? "Tài liệu pháp lý (GPKD) *"
                          : "Legal Document *"}
                      </label>
                      <label
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed cursor-pointer transition-colors ${
                          data.hasLegalDoc
                            ? "border-emerald-500/40 bg-emerald-500/[0.06]"
                            : "border-white/15 bg-white/[0.03] hover:border-accent/40"
                        }`}
                      >
                        {data.hasLegalDoc ? (
                          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                        ) : (
                          <Upload className="w-4.5 h-4.5 text-white/40 shrink-0" />
                        )}
                        <span
                          className={`text-sm ${
                            data.hasLegalDoc
                              ? "text-emerald-400 font-bold"
                              : "text-muted-foreground"
                          }`}
                        >
                          {data.hasLegalDoc
                            ? lang === "vn"
                              ? "Đã đính kèm tài liệu"
                              : "Document attached"
                            : lang === "vn"
                              ? "Tải lên GPKD / Quyết định thành lập"
                              : "Upload business certificate"}
                        </span>
                        <input
                          type="file"
                          className="sr-only"
                          onChange={() =>
                            setData({ ...data, hasLegalDoc: true })
                          }
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/[0.08] border border-amber-500/20 text-amber-300 text-xs leading-relaxed">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>
                      {lang === "vn"
                        ? "Cam kết: Hồ sơ nộp tự nguyện, tuân thủ nghĩa vụ hội phí thường niên và các điều khoản trong Dự thảo Điều lệ hoạt động của Hiệp hội."
                        : "Pledge: this application is voluntary and binds you to the annual fee and the association's public charter."}
                    </p>
                  </div>

                  <div className="pt-3 flex justify-between">
                    <button
                      onClick={() => setStep(1)}
                      className="px-5 h-11 rounded-xl font-bold text-sm border border-white/10 hover:bg-white/5 active:scale-[0.98] transition-all text-white cursor-pointer flex items-center gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      {lang === "vn" ? "Quay lại" : "Back"}
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="px-6 h-11 rounded-xl font-bold text-sm text-accent-foreground hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
                      style={{
                        background: "var(--gradient-gold)",
                        boxShadow: "var(--shadow-gold)",
                      }}
                    >
                      <Check className="w-4 h-4" />
                      {lang === "vn" ? "Nộp hồ sơ" : "Submit Application"}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3 — success */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="py-6 text-center space-y-5 max-w-md mx-auto"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h2 className="display text-xl font-black text-white">
                    {lang === "vn"
                      ? "Nộp hồ sơ thành công!"
                      : "Application Submitted!"}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {lang === "vn"
                      ? "Ban Thư ký sẽ thẩm định tư cách pháp nhân trực tuyến và phản hồi chính thức trong tối đa 30 ngày làm việc."
                      : "The Secretariat will verify your legal files online and respond within 30 business days."}
                  </p>

                  <div className="p-5 rounded-2xl border border-accent/25 bg-accent/[0.06]">
                    <span className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
                      {lang === "vn" ? "Mã số biên nhận" : "Tracking ID"}
                    </span>
                    <span className="font-mono text-2xl font-black text-accent mt-1.5 block tracking-[0.12em]">
                      {trackingCode}
                    </span>
                    <span className="text-[11px] text-amber-400 font-bold mt-2.5 flex items-center justify-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      {lang === "vn"
                        ? "Đang thẩm tra trực tuyến"
                        : "Under online verification"}
                    </span>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      onClick={reset}
                      className="px-5 h-11 rounded-xl font-bold text-sm border border-white/10 hover:bg-white/5 active:scale-[0.98] transition-all text-white cursor-pointer"
                    >
                      {lang === "vn" ? "Nộp đơn khác" : "New Application"}
                    </button>
                    <Link
                      to="/portal"
                      className="px-5 h-11 rounded-xl font-bold text-sm text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
                      style={{
                        background: "var(--gradient-primary)",
                        boxShadow: "var(--shadow-glow)",
                      }}
                    >
                      <LogIn className="w-4 h-4" />
                      {lang === "vn" ? "Về trang Đăng nhập" : "Back to Sign-in"}
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Info rail */}
          <aside className="lg:col-span-5 space-y-4">
            {[
              {
                icon: Building,
                title: lang === "vn" ? "Điều kiện gia nhập" : "Eligibility",
                body:
                  lang === "vn"
                    ? "Tổ chức, doanh nghiệp hoạt động trong lĩnh vực công nghệ số tại Đà Nẵng, có tư cách pháp nhân hợp lệ theo quy định."
                    : "Digital-technology organisations operating in Danang with valid legal status.",
              },
              {
                icon: Clock,
                title:
                  lang === "vn" ? "Thẩm tra trong 30 ngày" : "30-day Review",
                body:
                  lang === "vn"
                    ? "Ban Thư ký xác thực hồ sơ trực tuyến, trình Ban Chấp hành phê duyệt và thông báo qua email đăng ký."
                    : "The Secretariat verifies online, the Executive Board approves, and you are notified by email.",
              },
              {
                icon: CreditCard,
                title: lang === "vn" ? "Hội phí minh bạch" : "Transparent Dues",
                body:
                  lang === "vn"
                    ? "Hội viên Tổ chức: 5.000.000 VNĐ/niên khóa. Mọi thu chi đều công khai trên Văn phòng số để Hội viên giám sát."
                    : "Corporate membership: 5,000,000 VND/term. All transactions are published on the Digital Office.",
              },
              {
                icon: BadgeCheck,
                title: lang === "vn" ? "Quyền lợi Hội viên" : "Member Benefits",
                body:
                  lang === "vn"
                    ? "Thẻ Hội viên số, danh bạ toàn Hiệp hội, tài nguyên nội bộ và quyền phản biện chính sách trực tiếp."
                    : "Digital member card, association directory, internal resources and direct policy feedback rights.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="card-surface rounded-2xl p-5 flex gap-4"
              >
                <span className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                  <item.icon className="w-4.5 h-4.5 text-accent" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 flex items-center gap-4">
              <Scale className="w-5 h-5 text-muted-foreground shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                {lang === "vn" ? (
                  <>
                    Đã được cấp tài khoản?{" "}
                    <Link
                      to="/portal"
                      className="text-cyan-300 font-bold hover:underline"
                    >
                      Đăng nhập Văn phòng số
                    </Link>{" "}
                    để quản lý hồ sơ Hội viên.
                  </>
                ) : (
                  <>
                    Already credentialed?{" "}
                    <Link
                      to="/portal"
                      className="text-cyan-300 font-bold hover:underline"
                    >
                      Sign in to the Digital Office
                    </Link>{" "}
                    to manage your member record.
                  </>
                )}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
