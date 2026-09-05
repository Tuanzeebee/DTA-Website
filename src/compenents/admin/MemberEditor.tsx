import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Save, X } from "lucide-react";
import type { DtaMember } from "@/data";
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
  const [role, setRole] = useState(initial?.role ?? "Hội viên");
  const [type, setType] = useState<DtaMember["type"]>(
    initial?.type ?? "organization",
  );
  const [domain, setDomain] = useState(initial?.domain ?? "");
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
        role: role.trim() || "Hội viên",
        type,
        domain: domain.trim(),
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
        <Field label="Tên hội viên *">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Công ty Cổ phần…"
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

        <Field label="Lĩnh vực hoạt động">
          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Phát triển phần mềm, AI…"
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
