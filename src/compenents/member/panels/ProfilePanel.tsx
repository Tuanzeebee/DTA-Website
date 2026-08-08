import { toast } from "sonner";
import { User, Check } from "lucide-react";
import type { Lang } from "@/types";

export interface ProfileData {
  companyName: string;
  representative: string;
  techStack: string;
  website: string;
  staffCount: string;
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      lang === "vn"
        ? "Cập nhật hồ sơ năng lực thành công!"
        : "Profile updated successfully!",
    );
  };

  const set =
    (key: keyof ProfileData) => (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange({ ...data, [key]: e.target.value });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-white/8">
        <span className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
          <User className="w-4 h-4 text-cyan-300" />
        </span>
        <div>
          <h4 className="display text-base font-black text-white">
            {lang === "vn"
              ? "Hồ sơ năng lực Doanh nghiệp"
              : "Capability Profile"}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            {lang === "vn"
              ? "Thông tin hiển thị trong danh bạ Hội viên toàn Hiệp hội."
              : "Shown in the association-wide member directory."}
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>
            {lang === "vn" ? "Tên doanh nghiệp / Tổ chức" : "Organization Name"}
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
              ? "Người đại diện trước Hiệp hội"
              : "Legal Representative"}
          </label>
          <input
            type="text"
            value={data.representative}
            onChange={set("representative")}
            className={FIELD_SHELL}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={LABEL}>
            {lang === "vn"
              ? "Năng lực & Trọng tâm Công nghệ"
              : "Core Technical Focus"}
          </label>
          <input
            type="text"
            value={data.techStack}
            onChange={set("techStack")}
            className={FIELD_SHELL}
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
      </div>

      <div className="pt-5 border-t border-white/8 flex justify-end">
        <button
          type="submit"
          className="px-6 h-11 rounded-xl font-bold text-sm text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
          style={{
            background: "var(--gradient-primary)",
            boxShadow: "var(--shadow-glow)",
          }}
        >
          <Check className="w-4 h-4" />
          <span>{lang === "vn" ? "Lưu thay đổi hồ sơ" : "Save Changes"}</span>
        </button>
      </div>
    </form>
  );
}
