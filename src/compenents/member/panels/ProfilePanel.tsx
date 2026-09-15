import { useState } from "react";
import { toast } from "sonner";
import { User, Check } from "lucide-react";
import type { Lang } from "@/types";
import type { MemberOwnership } from "@/data";
import { memberUpdateProfile } from "@/lib/api";
import {
  firstMissingDirectoryField,
  directoryErrorMessage,
} from "@/lib/memberDirectory";

export interface ProfileData {
  companyName: string;
  companyNameEn: string;
  ownership: MemberOwnership | "";
  representative: string;
  phone: string;
  techStack: string;
  strengths: string;
  website: string;
  staffCount: string;
  cooperationNeed: string;
  contactInvite: string;
}

const FIELD_SHELL =
  "w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/50 focus:bg-white/[0.06] transition-colors";

const LABEL =
  "block text-[11px] uppercase tracking-wider text-muted-foreground font-bold mb-1.5";

/** "Hồ sơ Hội viên" — the organisation's public capability profile. */
export function ProfilePanel({
  lang,
  data,
  onChange,
}: {
  lang: Lang;
  data: ProfileData;
  onChange: (next: ProfileData) => void;
}) {
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const missing = firstMissingDirectoryField({
      nameVi: data.companyName,
      nameEn: data.companyNameEn,
      ownership: data.ownership,
      leader: data.representative,
      phone: data.phone,
      field: data.techStack,
      strengths: data.strengths,
    });
    if (missing) {
      toast.error(
        directoryErrorMessage(
          lang,
          missing,
          missing === "phone" && data.phone.trim().length > 0,
        ),
      );
      return;
    }
    setSaving(true);
    try {
      const updated = await memberUpdateProfile({
        name: data.companyName.trim(),
        nameEn: data.companyNameEn.trim(),
        domain: data.techStack.trim(),
        ownership: data.ownership,
        leader: data.representative.trim(),
        phone: data.phone.trim(),
        strengths: data.strengths.trim(),
        website: data.website.trim() || undefined,
      });
      onChange({
        ...data,
        companyName: updated.name,
        companyNameEn: updated.nameEn ?? "",
        ownership:
          updated.ownership === "fdi" || updated.ownership === "domestic"
            ? updated.ownership
            : "",
        representative: updated.leader ?? "",
        phone: updated.phone ?? "",
        techStack: updated.domain,
        strengths: updated.strengths ?? "",
        website: updated.website ?? "",
      });
      toast.success(
        lang === "vn"
          ? "Đã lưu hồ sơ! Thông tin Danh bạ hội viên được cập nhật ngay."
          : "Profile saved! The member directory is updated.",
      );
    } catch (err: unknown) {
      toast.error(
        err instanceof Error
          ? err.message
          : lang === "vn"
            ? "Lưu hồ sơ thất bại, vui lòng thử lại."
            : "Save failed, please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const set =
    (key: keyof ProfileData) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => onChange({ ...data, [key]: e.target.value });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-white/8">
        <span className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
          <User className="w-4 h-4 text-cyan-300" />
        </span>
        <div>
          <h4 className="display text-base font-black text-white">
            {lang === "vn" ? "Chúng tôi nói về mình" : "About Us"}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            {lang === "vn"
              ? "Hồ sơ năng lực — giới thiệu doanh nghiệp, tổ chức, đơn vị mình trong danh bạ Hội viên. Tất cả 7 trường đều bắt buộc."
              : "Capability profile — introduce your business in the member directory. All 7 fields are required."}
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>
            {lang === "vn"
              ? "Tên công ty (tiếng Việt) *"
              : "Company name (Vietnamese) *"}
          </label>
          <input
            type="text"
            value={data.companyName}
            onChange={set("companyName")}
            className={FIELD_SHELL}
          />
        </div>
        <div>
          <label className={LABEL}>
            {lang === "vn"
              ? "Tên công ty (tiếng Anh) *"
              : "Company name (English) *"}
          </label>
          <input
            type="text"
            value={data.companyNameEn}
            onChange={set("companyNameEn")}
            className={FIELD_SHELL}
          />
        </div>
        <div>
          <label className={LABEL}>
            {lang === "vn" ? "Loại hình *" : "Ownership *"}
          </label>
          <select
            value={data.ownership}
            onChange={set("ownership")}
            className={`${FIELD_SHELL} cursor-pointer`}
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
            value={data.representative}
            onChange={set("representative")}
            className={FIELD_SHELL}
          />
        </div>
        <div>
          <label className={LABEL}>
            {lang === "vn" ? "Điện thoại *" : "Phone *"}
          </label>
          <input
            type="tel"
            value={data.phone}
            onChange={set("phone")}
            className={FIELD_SHELL}
          />
        </div>
        <div>
          <label className={LABEL}>
            {lang === "vn" ? "Lĩnh vực hoạt động *" : "Field of activity *"}
          </label>
          <input
            type="text"
            value={data.techStack}
            onChange={set("techStack")}
            className={FIELD_SHELL}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={LABEL}>
            {lang === "vn" ? "Thế mạnh *" : "Key strengths *"}
          </label>
          <textarea
            rows={2}
            value={data.strengths}
            onChange={set("strengths")}
            className={`${FIELD_SHELL} resize-none`}
          />
        </div>
        <div>
          <label className={LABEL}>Website</label>
          <input
            type="text"
            value={data.website}
            onChange={set("website")}
            className={FIELD_SHELL}
          />
        </div>
        <div>
          <label className={LABEL}>
            {lang === "vn" ? "Số lượng nhân sự số" : "Tech Staff Count"}
          </label>
          <input
            type="number"
            value={data.staffCount}
            onChange={set("staffCount")}
            className={FIELD_SHELL}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={LABEL}>
            {lang === "vn"
              ? "Nhu cầu hợp tác, liên danh-liên kết"
              : "Cooperation Needs"}
          </label>
          <textarea
            rows={2}
            value={data.cooperationNeed}
            onChange={set("cooperationNeed")}
            placeholder={
              lang === "vn"
                ? "VD: Tìm đối tác phát triển AI camera, mời liên danh dự án chuyển đổi số..."
                : "E.g. Looking for AI camera partners, joint bids for digital projects..."
            }
            className={`${FIELD_SHELL} resize-none`}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={LABEL}>
            {lang === "vn" ? "Lời mời hợp tác công khai" : "Public Invite"}
          </label>
          <textarea
            rows={2}
            value={data.contactInvite}
            onChange={set("contactInvite")}
            placeholder={
              lang === "vn"
                ? "VD: Sẵn sàng chia sẻ năng lực, nhận lời mời demo, kết nối B2B..."
                : "E.g. Open for demos, B2B matching, capability sharing..."
            }
            className={`${FIELD_SHELL} resize-none`}
          />
        </div>
      </div>

      <div className="pt-5 border-t border-white/8 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-6 h-11 rounded-xl font-bold text-sm text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          style={{
            background: "var(--gradient-primary)",
            boxShadow: "var(--shadow-glow)",
          }}
        >
          <Check className="w-4 h-4" />
          <span>
            {saving
              ? lang === "vn"
                ? "Đang lưu…"
                : "Saving…"
              : lang === "vn"
                ? "Lưu thay đổi hồ sơ"
                : "Save Changes"}
          </span>
        </button>
      </div>
    </form>
  );
}
