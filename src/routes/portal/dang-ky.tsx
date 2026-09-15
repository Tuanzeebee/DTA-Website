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
  BadgeCheck,
  Clock,
  CreditCard,
  Upload,
} from "lucide-react";
import { useLang } from "@/hooks/useLang";
import { submitApplication } from "@/lib/api";
import {
  EMPTY_DIRECTORY_FORM,
  directoryErrorMessage,
  firstMissingDirectoryField,
  type MemberDirectoryForm,
} from "@/lib/memberDirectory";

/**
 * /portal/dang-ky — standalone membership application.
 *
 * Deliberately OUTSIDE the sign-in wall: a prospective member has no account
 * yet, so enrollment must be reachable by anyone (and shareable by URL).
 *
 * Step 1 = Thông tin Hội viên: đúng 7 trường Danh bạ hội viên
 * (tên Việt/Anh, loại hình, lãnh đạo, điện thoại, lĩnh vực, thế mạnh)
 * + email liên hệ. Step 2 = 2 file tải lên + lĩnh vực công nghệ.
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
  const [directory, setDirectory] =
    useState<MemberDirectoryForm>({ ...EMPTY_DIRECTORY_FORM });
  const [data, setData] = useState({
    email: "",
    techField: "AI",
    consentFileName: "",
    legalFileName: "",
    hasConsentDoc: false,
    hasLegalDoc: false,
  });
  const [consentFile, setConsentFile] = useState<File | null>(null);
  const [legalFile, setLegalFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const stepLabels = [
    lang === "vn" ? "Thông tin Hội viên" : "Member Info",
    lang === "vn" ? "Pháp lý & Hồ sơ" : "Legal & Files",
    lang === "vn" ? "Hoàn tất" : "Done",
  ];

  const setDir = (key: keyof MemberDirectoryForm) => (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => setDirectory((prev) => ({ ...prev, [key]: e.target.value }));

  const requireStep1 = (): boolean => {
    const missing = firstMissingDirectoryField(directory);
    if (missing) {
      const phoneTooShort =
        missing === "phone" && directory.phone.trim().length > 0;
      toast.error(directoryErrorMessage(lang, missing, phoneTooShort));
      return false;
    }
    if (!data.email.trim()) {
      toast.error(
        lang === "vn"
          ? 'Vui lòng nhập "Email liên hệ chính" — trường bắt buộc.'
          : 'Please fill in "Primary email" — required.',
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

  const handleSubmit = async () => {
    if (!consentFile) {
      toast.error(
        lang === "vn"
          ? "Vui lòng tải lên Công văn đồng ý trở thành Hội viên DTA."
          : "Please upload the consent letter to join DTA.",
      );
      return;
    }
    if (!legalFile) {
      toast.error(
        lang === "vn"
          ? "Vui lòng tải lên GPKD / Giấy chứng nhận ĐKKD / Quyết định thành lập."
          : "Please upload your business certificate / establishment decision.",
      );
      return;
    }
    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("orgName", directory.nameVi.trim());
      form.append("nameEn", directory.nameEn.trim());
      form.append("ownership", directory.ownership);
      form.append("leader", directory.leader.trim());
      form.append("contactName", directory.leader.trim());
      form.append("email", data.email.trim());
      form.append("phone", directory.phone.trim());
      form.append("type", "organization");
      form.append("domain", directory.field.trim());
      form.append("strengths", directory.strengths.trim());
      form.append("techField", data.techField);
      form.append("consentDoc", consentFile);
      form.append("legalDoc", legalFile);
      const created = await submitApplication(form);
      setTrackingCode(created.trackingCode);
      setStep(3);
      toast.success(
        lang === "vn"
          ? "Đã nộp đơn gia nhập DTA thành công! Hiệp hội sẽ duyệt hồ sơ theo quy trình."
          : "Application submitted! The association will review it by procedure.",
      );
    } catch (err: unknown) {
      toast.error(
        err instanceof Error
          ? err.message
          : lang === "vn"
            ? "Nộp hồ sơ thất bại, vui lòng thử lại."
            : "Submission failed, please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setStep(1);
    setDirectory({ ...EMPTY_DIRECTORY_FORM });
    setConsentFile(null);
    setLegalFile(null);
    setData({
      email: "",
      techField: "AI",
      consentFileName: "",
      legalFileName: "",
      hasConsentDoc: false,
      hasLegalDoc: false,
    });
  };

  const uploadBox = (
    attached: boolean,
    fileName: string,
    onFile: (f: File) => void,
    emptyText: string,
  ) => (
    <label
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed cursor-pointer transition-colors ${
        attached
          ? "border-emerald-500/40 bg-emerald-500/[0.06]"
          : "border-white/15 bg-white/[0.03] hover:border-accent/40"
      }`}
    >
      {attached ? (
        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
      ) : (
        <Upload className="w-4.5 h-4.5 text-white/40 shrink-0" />
      )}
      <span
        className={`text-sm truncate ${
          attached ? "text-emerald-400 font-bold" : "text-muted-foreground"
        }`}
      >
        {attached ? fileName : emptyText}
      </span>
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
        }}
      />
    </label>
  );

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
              ? "Số hóa 100% quy trình: nộp hồ sơ, Hiệp hội duyệt theo quy trình và phê duyệt theo Điều lệ — tối đa 30 ngày, không cần giấy tờ bản cứng."
              : "A fully digitized pipeline: apply, association review by procedure and charter approval — within 30 days, no paperwork required."}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Form column */}
          <div className="lg:col-span-7">
            <div className="card-surface rounded-3xl p-6 md:p-8">
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
                {/* STEP 1 — Thông tin Hội viên = 7 trường Danh bạ + email */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -14 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="space-y-5"
                  >
                    <p className="text-xs text-muted-foreground leading-relaxed rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3">
                      {lang === "vn"
                        ? "Thông tin căn bản này sẽ xuất hiện trong mục Danh bạ hội viên sau khi được duyệt. Tất cả 7 trường đều bắt buộc."
                        : "This basic info will appear in the member directory after approval. All 7 fields are required."}
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className={LABEL}>
                          {lang === "vn"
                            ? "Tên công ty (tiếng Việt) *"
                            : "Company name (Vietnamese) *"}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Công ty TNHH SoftTech Đà Nẵng"
                          value={directory.nameVi}
                          onChange={setDir("nameVi")}
                          className={FIELD}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={LABEL}>
                          {lang === "vn"
                            ? "Tên công ty (tiếng Anh) *"
                            : "Company name (English) *"}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. SoftTech Danang Co., Ltd."
                          value={directory.nameEn}
                          onChange={setDir("nameEn")}
                          className={FIELD}
                        />
                      </div>
                      <div>
                        <label className={LABEL}>
                          {lang === "vn"
                            ? "Loại hình (trong nước / FDI) *"
                            : "Ownership (domestic / FDI) *"}
                        </label>
                        <select
                          value={directory.ownership}
                          onChange={setDir("ownership")}
                          className={`${FIELD} cursor-pointer`}
                        >
                          <option value="">
                            {lang === "vn" ? "— Chọn —" : "— Select —"}
                          </option>
                          <option value="domestic">
                            {lang === "vn" ? "Trong nước" : "Domestic"}
                          </option>
                          <option value="fdi">FDI</option>
                        </select>
                      </div>
                      <div>
                        <label className={LABEL}>
                          {lang === "vn" ? "Lãnh đạo *" : "Leader *"}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Trần Minh Quân"
                          value={directory.leader}
                          onChange={setDir("leader")}
                          className={FIELD}
                        />
                      </div>
                      <div>
                        <label className={LABEL}>
                          {lang === "vn" ? "Điện thoại *" : "Phone *"}
                        </label>
                        <input
                          type="tel"
                          placeholder="e.g. 0236 3xxx xxx"
                          value={directory.phone}
                          onChange={setDir("phone")}
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
                      <div>
                        <label className={LABEL}>
                          {lang === "vn"
                            ? "Lĩnh vực hoạt động *"
                            : "Field of activity *"}
                        </label>
                        <input
                          type="text"
                          placeholder={
                            lang === "vn"
                              ? "e.g. AI, vi mạch, phần mềm…"
                              : "e.g. AI, chips, software…"
                          }
                          value={directory.field}
                          onChange={setDir("field")}
                          className={FIELD}
                        />
                      </div>
                      <div>
                        <label className={LABEL}>
                          {lang === "vn" ? "Thế mạnh *" : "Key strengths *"}
                        </label>
                        <input
                          type="text"
                          placeholder={
                            lang === "vn"
                              ? "e.g. AI camera, IoT công nghiệp…"
                              : "e.g. AI cameras, industrial IoT…"
                          }
                          value={directory.strengths}
                          onChange={setDir("strengths")}
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

                {/* STEP 2 — pháp lý: 2 file tải lên + lĩnh vực */}
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
                      <div className="sm:col-span-2">
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
                            {lang === "vn"
                              ? "AI & Dữ liệu lớn"
                              : "AI & Big Data"}
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
                      <div className="sm:col-span-2">
                        <label className={LABEL}>
                          {lang === "vn"
                            ? "Công văn đồng ý trở thành Hội viên DTA *"
                            : "Consent letter to join DTA *"}
                        </label>
                        {uploadBox(
                          data.hasConsentDoc,
                          data.consentFileName,
                          (f) => {
                            setConsentFile(f);
                            setData({
                              ...data,
                              hasConsentDoc: true,
                              consentFileName: f.name,
                            });
                          },
                          lang === "vn"
                            ? "Tải lên công văn (PDF/ảnh, tối đa 10MB)"
                            : "Upload consent letter (PDF/image, max 10MB)",
                        )}
                      </div>
                      <div className="sm:col-span-2">
                        <label className={LABEL}>
                          {lang === "vn"
                            ? "GPKD / Giấy CN ĐKKD / Quyết định thành lập DN-Chi nhánh *"
                            : "Business certificate / Establishment decision *"}
                        </label>
                        {uploadBox(
                          data.hasLegalDoc,
                          data.legalFileName,
                          (f) => {
                            setLegalFile(f);
                            setData({
                              ...data,
                              hasLegalDoc: true,
                              legalFileName: f.name,
                            });
                          },
                          lang === "vn"
                            ? "Tải lên GPKD / Quyết định thành lập"
                            : "Upload business certificate",
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/[0.08] border border-amber-500/20 text-amber-300 text-xs leading-relaxed">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <p>
                        {lang === "vn"
                          ? "Cam kết: Hồ sơ nộp tự nguyện, tuân thủ nghĩa vụ hội phí thường niên và các điều khoản trong Điều lệ hoạt động của Hiệp hội (QĐ số 3189/QĐ-UBND ngày 20/7/2026)."
                          : "Pledge: this application is voluntary and binds you to the annual fee and the association charter (Decision 3189/QD-UBND dated 20/07/2026)."}
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
                        disabled={submitting}
                        className="px-6 h-11 rounded-xl font-bold text-sm text-accent-foreground hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        style={{
                          background: "var(--gradient-gold)",
                          boxShadow: "var(--shadow-gold)",
                        }}
                      >
                        <Check className="w-4 h-4" />
                        {submitting
                          ? lang === "vn"
                            ? "Đang nộp…"
                            : "Submitting…"
                          : lang === "vn"
                            ? "Nộp hồ sơ"
                            : "Submit Application"}
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
                        ? "Hiệp hội sẽ duyệt hồ sơ theo quy trình và phản hồi chính thức trong tối đa 30 ngày làm việc. Khi được kết nạp, Ban Thư ký cấp tài khoản + mật khẩu đăng nhập Không gian số."
                        : "The association will review your file by procedure within 30 business days. On approval, the Secretariat issues your Member Space login and password."}
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
                          ? "Hiệp hội đang duyệt hồ sơ"
                          : "Under association review"}
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
                        {lang === "vn"
                          ? "Về Không gian số"
                          : "Back to Member Space"}
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
                  lang === "vn"
                    ? "Hiệp hội duyệt hồ sơ theo quy trình"
                    : "Association Review by Procedure",
                body:
                  lang === "vn"
                    ? "Thẩm tra trong vòng 30 ngày: Ban Thư ký xác thực hồ sơ trực tuyến, trình Ban Chấp hành phê duyệt, ban hành quyết định công nhận và thông báo qua email đăng ký."
                    : "Review within 30 days: online verification, board approval, recognition decision and email notification.",
              },
              {
                icon: CreditCard,
                title: lang === "vn" ? "Hội phí minh bạch" : "Transparent Fees",
                body:
                  lang === "vn"
                    ? "Hội viên tổ chức: tùy quy mô, từ 3 đến 5.000.000 VNĐ/năm. Mọi thu chi được công khai, báo cáo minh bạch tại các phiên họp toàn thể để Hội viên biết, thực hành quyền giám sát."
                    : "Corporate members: 3 to 5,000,000 VND/year depending on scale. All income and spending is disclosed at plenary meetings for member supervision.",
              },
              {
                icon: BadgeCheck,
                title: lang === "vn" ? "Quyền lợi Hội viên" : "Member Benefits",
                body:
                  lang === "vn"
                    ? "Được quy định cụ thể tại Điều lệ hoạt động do UBND thành phố phê duyệt (QĐ số 3189/QĐ-UBND ngày 20/7/2026)."
                    : "As specified in the charter approved by the City People's Committee (Decision 3189/QD-UBND dated 20/07/2026).",
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
          </aside>
        </div>
      </div>
    </main>
  );
}
