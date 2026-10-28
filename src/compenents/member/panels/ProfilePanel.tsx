import { useState } from "react";
import { toast } from "sonner";
import { User, Check, KeyRound } from "lucide-react";
import type { Lang } from "@/types";
import {
  contactPayload,
  pickContact,
  type MemberContactKey,
  type MemberOwnership,
} from "@/data";
import { ContactFields } from "@/compenents/member/ContactFields";
import { changeOwnPassword, memberUpdateProfile } from "@/lib/api";
import {
  firstMissingDirectoryField,
  directoryErrorMessage,
} from "@/lib/memberDirectory";

export interface ProfileData extends Record<MemberContactKey, string> {
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
    const form = {
      nameVi: data.companyName,
      nameEn: data.companyNameEn,
      ownership: data.ownership,
      leader: data.representative,
      phone: data.phone,
      field: data.techStack,
      strengths: data.strengths,
      leaderEmail: data.leaderEmail,
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      contactEmail: data.contactEmail,
      address: data.address,
    };
    const missing = firstMissingDirectoryField(form);
    if (missing) {
      toast.error(directoryErrorMessage(lang, missing, form));
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
        ...contactPayload(data),
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
        ...contactPayload(pickContact(updated)),
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
    <>
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
              ? "Hồ sơ năng lực, thế mạnh — hiển thị trên thẻ hội viên trong Danh bạ. Các trường có dấu * là bắt buộc."
              : "Capability profile — shown on your member card in the directory. Fields marked * are required."}
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
            {lang === "vn" ? "Điện thoại lãnh đạo *" : "Leader phone *"}
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
        <ContactFields
          lang={lang}
          value={data}
          onChange={(key, v) => onChange({ ...data, [key]: v })}
          inputClass={FIELD_SHELL}
          labelClass={LABEL}
          required
        />
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
    <ChangePasswordForm lang={lang} />
    </>
  );
}

/** Hội viên tự quản mật khẩu (góp ý 27/10/2026). */
function ChangePasswordForm({ lang }: { lang: Lang }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next.length < 8) {
      toast.error(
        lang === "vn"
          ? "Mật khẩu mới cần ít nhất 8 ký tự."
          : "New password needs at least 8 characters.",
      );
      return;
    }
    if (next !== confirm) {
      toast.error(
        lang === "vn" ? "Mật khẩu nhập lại không khớp." : "Passwords do not match.",
      );
      return;
    }
    setSaving(true);
    try {
      await changeOwnPassword(current, next);
      setCurrent("");
      setNext("");
      setConfirm("");
      toast.success(lang === "vn" ? "Đã đổi mật khẩu." : "Password changed.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      toast.error(
        msg.includes("Mật khẩu hiện tại không đúng")
          ? lang === "vn"
            ? "Mật khẩu hiện tại không đúng."
            : "Current password is wrong."
          : lang === "vn"
            ? "Không đổi được mật khẩu."
            : "Could not change password.",
      );
    } finally {
      setSaving(false);
    }
  };

  const fields: [string, string, string, (v: string) => void, string][] = [
    ["pw-current", lang === "vn" ? "Mật khẩu hiện tại" : "Current password", current, setCurrent, "current-password"],
    ["pw-new", lang === "vn" ? "Mật khẩu mới" : "New password", next, setNext, "new-password"],
    ["pw-confirm", lang === "vn" ? "Nhập lại mật khẩu mới" : "Confirm new password", confirm, setConfirm, "new-password"],
  ];

  return (
    <form onSubmit={submit} className="mt-10 pt-6 border-t border-white/8 space-y-4">
      <h4 className="display text-base font-black text-white flex items-center gap-2">
        <KeyRound className="w-4 h-4 text-cyan-300" />
        {lang === "vn" ? "Đổi mật khẩu" : "Change password"}
      </h4>
      <div className="grid sm:grid-cols-3 gap-4">
        {fields.map(([id, label, value, set, auto]) => (
          <div key={id}>
            <label htmlFor={id} className={LABEL}>
              {label}
            </label>
            <input
              id={id}
              type="password"
              autoComplete={auto}
              value={value}
              onChange={(e) => set(e.target.value)}
              className={FIELD_SHELL}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving || !current || !next}
          className="px-6 h-11 rounded-xl font-bold text-sm border border-white/15 text-white hover:bg-white/5 transition-all cursor-pointer disabled:opacity-50"
        >
          {saving
            ? lang === "vn"
              ? "Đang đổi…"
              : "Saving…"
            : lang === "vn"
              ? "Đổi mật khẩu"
              : "Change password"}
        </button>
      </div>
    </form>
  );
}
