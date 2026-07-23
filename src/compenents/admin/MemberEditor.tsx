import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Save, X } from "lucide-react";
import type { DtaMember } from "@/data";
import { newMemberId } from "@/compenents/admin/memberStore";
import { ImageInput } from "@/compenents/admin/ArticleEditor";

/**
 * Add/edit form for one member. Bilingual fields keep VN as the source of
 * truth — an empty EN falls back to the VN value on save, so editors are
 * never blocked on translations.
 */
export function MemberEditor({
  initial,
  onSave,
  onCancel,
}: {
  initial?: DtaMember;
  onSave: (member: DtaMember) => void;
  onCancel: () => void;
}) {
  const [nameVn, setNameVn] = useState(initial?.name.vn ?? "");
  const [nameEn, setNameEn] = useState(initial?.name.en ?? "");
  const [roleVn, setRoleVn] = useState(initial?.role.vn ?? "");
  const [roleEn, setRoleEn] = useState(initial?.role.en ?? "");
  const [type, setType] = useState<DtaMember["type"]>(
    initial?.type ?? "organization",
  );
  const [domainVn, setDomainVn] = useState(initial?.domain.vn ?? "");
  const [domainEn, setDomainEn] = useState(initial?.domain.en ?? "");
  const [initials, setInitials] = useState(initial?.logoInitials ?? "");
  const [logoUrl, setLogoUrl] = useState(initial?.logoUrl ?? "");
  const [website, setWebsite] = useState(initial?.website ?? "");

  const submit = () => {
    if (!nameVn.trim()) {
      toast.error("Cần nhập tên hội viên (tiếng Việt).");
      return;
    }
    const fallbackInitials =
      nameVn
        .trim()
        .split(/\s+/)
        .slice(-3)
        .map((w) => w[0])
        .join("")
        .toUpperCase() || "DTA";
    onSave({
      id: initial?.id ?? newMemberId(),
      name: { vn: nameVn.trim(), en: nameEn.trim() || nameVn.trim() },
      role: {
        vn: roleVn.trim() || "Hội viên",
        en: roleEn.trim() || roleVn.trim() || "Member",
      },
      type,
      domain: {
        vn: domainVn.trim(),
        en: domainEn.trim() || domainVn.trim(),
      },
      logoInitials: initials.trim().toUpperCase() || fallbackInitials,
      logoUrl: logoUrl.trim() || undefined,
      website: website.trim() || undefined,
    });
  };

  return (
    <div className="rounded-2xl border border-accent/30 bg-white/[0.02] p-5">
      <div className="flex items-center mb-4">
        <h2 className="text-sm font-black uppercase tracking-wider text-white mr-auto">
          {initial ? "Sửa hội viên" : "Thêm hội viên mới"}
        </h2>
        <button
          onClick={onCancel}
          aria-label="Đóng"
          className="p-1.5 rounded-lg text-white/50 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Tên hội viên (VN) *">
          <input
            value={nameVn}
            onChange={(e) => setNameVn(e.target.value)}
            placeholder="Công ty Cổ phần…"
            className={INPUT}
          />
        </Field>
        <Field label="Tên hội viên (EN — trống = dùng VN)">
          <input
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            className={INPUT}
          />
        </Field>

        <Field label="Vai trò (VN)">
          <input
            value={roleVn}
            onChange={(e) => setRoleVn(e.target.value)}
            placeholder="Hội viên Tổ chức · Doanh nghiệp phần mềm"
            className={INPUT}
          />
        </Field>
        <Field label="Vai trò (EN — trống = dùng VN)">
          <input
            value={roleEn}
            onChange={(e) => setRoleEn(e.target.value)}
            className={INPUT}
          />
        </Field>

        <Field label="Lĩnh vực hoạt động (VN)">
          <input
            value={domainVn}
            onChange={(e) => setDomainVn(e.target.value)}
            placeholder="Phát triển phần mềm, AI…"
            className={INPUT}
          />
        </Field>
        <Field label="Lĩnh vực (EN — trống = dùng VN)">
          <input
            value={domainEn}
            onChange={(e) => setDomainEn(e.target.value)}
            className={INPUT}
          />
        </Field>

        <Field label="Loại hội viên">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as DtaMember["type"])}
            className={INPUT}
          >
            <option value="organization">Tổ chức</option>
            <option value="individual">Cá nhân</option>
            <option value="advisory">Cố vấn</option>
          </select>
        </Field>
        <Field label="Chữ viết tắt trên logo (trống = tự sinh)">
          <input
            value={initials}
            onChange={(e) => setInitials(e.target.value)}
            maxLength={4}
            placeholder="FPT"
            className={INPUT}
          />
        </Field>
      </div>

      <div className="mt-4 space-y-4">
        <Field label="Logo — dán URL hoặc chọn file từ máy">
          <ImageInput value={logoUrl} onChange={setLogoUrl} />
        </Field>
        <Field label="Website hội viên (logo sẽ nhúng link này)">
          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://…"
            className={INPUT}
          />
        </Field>
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-xl border border-white/10 text-xs font-bold text-white/60 hover:text-white transition-colors cursor-pointer"
        >
          Hủy
        </button>
        <button
          onClick={submit}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-primary-foreground hover:opacity-90 transition-all cursor-pointer"
          style={{
            background: "var(--gradient-primary)",
            boxShadow: "var(--shadow-glow)",
          }}
        >
          <Save className="w-3.5 h-3.5" />
          {initial ? "Lưu thay đổi" : "Thêm hội viên"}
        </button>
      </div>
    </div>
  );
}

const INPUT =
  "w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/60";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-wider text-white/60 font-bold mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
