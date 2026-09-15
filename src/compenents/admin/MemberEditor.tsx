import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Save, X } from "lucide-react";
import type { DtaMember, MemberOwnership } from "@/data";
import { uploadImage } from "@/lib/api";

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

/**
 * Add/edit form for one member. Calls API via parent onSave callback.
 * Đủ 7 trường Danh bạ: tên Việt/Anh, loại hình, lãnh đạo, điện thoại,
 * lĩnh vực, thế mạnh — đồng nhất với form đăng ký + ProfilePanel.
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
  const [name, setName] = useState(initial?.name ?? "");
  const [nameEn, setNameEn] = useState(initial?.nameEn ?? "");
  const [role, setRole] = useState(initial?.role ?? "Hội viên");
  const [type, setType] = useState<DtaMember["type"]>(
    initial?.type ?? "organization",
  );
  const [domain, setDomain] = useState(initial?.domain ?? "");
  const [ownership, setOwnership] = useState<MemberOwnership | "">(
    initial?.ownership ?? "",
  );
  const [leader, setLeader] = useState(initial?.leader ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [strengths, setStrengths] = useState(initial?.strengths ?? "");
  const [logoUrl, setLogoUrl] = useState(initial?.logoUrl ?? "");
  const [website, setWebsite] = useState(initial?.website ?? "");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!name.trim()) {
      toast.error("Cần nhập tên hội viên.");
      return;
    }
    setSaving(true);
    try {
      onSave({
        id: initial?.id ?? "",
        name: name.trim(),
        nameEn: nameEn.trim() || undefined,
        role: role.trim() || "Hội viên",
        type,
        domain: domain.trim(),
        ownership: (ownership || undefined) as MemberOwnership | undefined,
        leader: leader.trim() || undefined,
        phone: phone.trim() || undefined,
        strengths: strengths.trim() || undefined,
        logoUrl: logoUrl.trim() || undefined,
        website: website.trim() || undefined,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (file: File) => {
    try {
      const url = await uploadImage(file);
      setLogoUrl(url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi upload";
      toast.error(msg);
    }
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
        <Field label="Tên hội viên (tiếng Việt) *">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Công ty Cổ phần…"
            className={INPUT}
          />
        </Field>
        <Field label="Tên tiếng Anh">
          <input
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            placeholder="… Co., Ltd."
            className={INPUT}
          />
        </Field>
        <Field label="Vai trò">
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Hội viên Tổ chức"
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
        <Field label="Loại hình (trong nước / FDI)">
          <select
            value={ownership}
            onChange={(e) =>
              setOwnership(e.target.value as MemberOwnership | "")
            }
            className={INPUT}
          >
            <option value="">— Chưa rõ —</option>
            <option value="domestic">Trong nước</option>
            <option value="fdi">FDI</option>
          </select>
        </Field>
        <Field label="Lãnh đạo / Người đại diện">
          <input
            value={leader}
            onChange={(e) => setLeader(e.target.value)}
            placeholder="Họ tên lãnh đạo"
            className={INPUT}
          />
        </Field>
        <Field label="Điện thoại">
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0236 …"
            className={INPUT}
          />
        </Field>
        <Field label="Lĩnh vực hoạt động">
          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Phát triển phần mềm, AI…"
            className={INPUT}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Thế mạnh">
            <input
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              placeholder="Năng lực nổi bật…"
              className={INPUT}
            />
          </Field>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <Field label="Logo URL">
          <input
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://… hoặc upload file bên dưới"
            className={INPUT}
          />
        </Field>
        <Field label="Hoặc upload logo từ máy">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleLogoUpload(file);
            }}
            className="w-full text-xs text-white/60 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
          />
        </Field>
        <Field label="Website hội viên">
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
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-primary-foreground hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
          style={{
            background: "var(--gradient-primary)",
            boxShadow: "var(--shadow-glow)",
          }}
        >
          <Save className="w-3.5 h-3.5" />
          {saving ? "Đang lưu..." : initial ? "Lưu thay đổi" : "Thêm hội viên"}
        </button>
      </div>
    </div>
  );
}
