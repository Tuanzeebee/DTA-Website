import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Save, X } from "lucide-react";
import type { AdminRole, AdminUser } from "@/lib/auth/types";
import { ROLE_LABEL } from "@/lib/auth/permissions";
import { adminCreateUser, adminSetUserRoles, adminSetUserStatus } from "@/lib/api";

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

function roleToBackend(r: AdminRole): string {
  if (r === "admin") return "ADMIN";
  if (r === "editor") return "EDITOR";
  return "MEMBER";
}

/**
 * Add/edit form for one directory account. Calls the real backend API.
 * On edit, empty password keeps the current one.
 */
export function UserEditor({
  initial,
  onSave,
  onCancel,
}: {
  initial?: AdminUser;
  onSave: (user: AdminUser) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [role, setRole] = useState<AdminRole>(initial?.role ?? "editor");
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(initial?.disabled ?? false);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!name.trim()) {
      toast.error("Cần nhập họ tên người dùng.");
      return;
    }
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      toast.error("Địa chỉ email chưa đúng định dạng.");
      return;
    }
    if (!initial && !password.trim()) {
      toast.error("Cần đặt mật khẩu cho tài khoản mới.");
      return;
    }

    setSaving(true);
    try {
      if (initial) {
        // Edit: update roles + status
        const backendRole = roleToBackend(role);
        await adminSetUserRoles(initial.id, [backendRole]);
        await adminSetUserStatus(initial.id, disabled ? "INACTIVE" : "ACTIVE");
        onSave({
          ...initial,
          name: name.trim(),
          email: normalizedEmail,
          role,
          disabled,
        });
        toast.success("Đã lưu thay đổi tài khoản.");
      } else {
        // Create new user
        const backendRole = roleToBackend(role);
        const created = await adminCreateUser({
          email: normalizedEmail,
          fullName: name.trim(),
          password: password.trim(),
          roles: [backendRole],
        });
        onSave({
          id: created.id,
          name: created.fullName,
          email: created.email,
          role,
          password: "",
          disabled: false,
        });
        toast.success(`Đã thêm ${ROLE_LABEL[role]} — có thể đăng nhập ngay.`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi không xác định";
      if (msg.includes("Email đã được sử dụng")) {
        toast.error("Email này đã có người dùng khác sử dụng.");
      } else {
        toast.error(`Lỗi: ${msg}`);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-accent/30 bg-white/[0.02] p-5">
      <div className="flex items-center mb-4">
        <h2 className="text-sm font-black uppercase tracking-wider text-white mr-auto">
          {initial ? "Sửa tài khoản" : "Thêm tài khoản"}
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
        <Field label="Họ tên *">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nguyễn Văn A"
            className={INPUT}
          />
        </Field>
        <Field label="Email đăng nhập *">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ten@dta.org.vn"
            className={INPUT}
          />
        </Field>

        <Field label="Vai trò *">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as AdminRole)}
            className={INPUT}
          >
            {(Object.keys(ROLE_LABEL) as AdminRole[]).map((r) => (
              <option key={r} value={r}>
                {ROLE_LABEL[r]}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label={initial ? "Mật khẩu mới (trống = giữ nguyên)" : "Mật khẩu *"}
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
            className={INPUT}
          />
        </Field>
      </div>

      <label className="mt-4 flex items-center gap-2.5 cursor-pointer w-fit">
        <input
          type="checkbox"
          checked={disabled}
          onChange={(e) => setDisabled(e.target.checked)}
          className="w-4 h-4 accent-cyan-400 cursor-pointer"
        />
        <span className="text-xs text-white/70 font-bold">
          Khóa tài khoản — không cho phép đăng nhập
        </span>
      </label>

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
          {saving ? "Đang lưu..." : initial ? "Lưu thay đổi" : "Thêm tài khoản"}
        </button>
      </div>
    </div>
  );
}
