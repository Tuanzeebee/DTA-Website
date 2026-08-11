import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  KeyRound,
} from "lucide-react";
import type { Lang } from "@/types";

/**
 * Portal sign-in card.
 *
 * Auth is a front-end demo (useSession), but the form behaves like a real one:
 * editable fields, basic validation, show/hide password — prefilled with the
 * demo member account so one click still works. The secondary action routes
 * prospective members to the standalone enrollment page.
 */
export function LoginCard({
  lang,
  onLogin,
  onAdminLogin,
}: {
  lang: Lang;
  onLogin: () => void;
  onAdminLogin?: () => void;
}) {
  const [email, setEmail] = useState("hoivien.demo@dta.org.vn");
  const [password, setPassword] = useState("demo2026");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error(
        lang === "vn"
          ? "Vui lòng nhập email và mật khẩu."
          : "Please enter both email and password.",
      );
      return;
    }
    /* Back-office shortcut for the demo: admin@gmail.com/admin skips the
       member flow and goes straight to /admin. The bare "admin" alias is kept
       for safety, but the field is type="email", so the browser's native
       validation only ever lets the @gmail.com form through. A wrong password
       gets its own error instead of falling through to the format complaint. */
    if (["admin", "admin@gmail.com"].includes(email.trim().toLowerCase())) {
      if (password === "admin") {
        onAdminLogin?.();
      } else {
        toast.error(
          lang === "vn"
            ? "Sai mật khẩu quản trị viên."
            : "Wrong administrator password.",
        );
      }
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error(
        lang === "vn"
          ? "Địa chỉ email chưa đúng định dạng."
          : "That email address doesn't look right.",
      );
      return;
    }
    onLogin();
  };

  const inputShell =
    "flex items-center h-11 rounded-xl border border-white/10 bg-white/[0.04] focus-within:border-cyan-400/50 focus-within:bg-white/[0.06] transition-colors";
  const inputInner =
    "w-full bg-transparent px-3 text-sm text-white placeholder:text-white/30 focus:outline-none";

  return (
    <div className="card-surface rounded-3xl p-7 md:p-8 flex flex-col">
      {/* Card heading */}
      <div className="flex items-center gap-3 pb-5 border-b border-white/8">
        <span className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
          <KeyRound className="w-4.5 h-4.5 text-cyan-300" />
        </span>
        <div>
          <h3 className="display text-lg font-black text-white leading-tight">
            {lang === "vn" ? "Đăng nhập" : "Member Sign-in"}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {lang === "vn"
              ? "Tài khoản do Ban Thư ký cấp khi phê duyệt hồ sơ."
              : "Credentials issued by the Secretariat on approval."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="portal-email"
            className="block text-[11px] uppercase tracking-wider text-muted-foreground font-bold mb-1.5"
          >
            Email
          </label>
          <div className={inputShell}>
            <Mail className="w-4 h-4 ml-3.5 text-white/35 shrink-0" />
            <input
              id="portal-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ten@doanhnghiep.vn"
              className={inputInner}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="portal-password"
            className="block text-[11px] uppercase tracking-wider text-muted-foreground font-bold mb-1.5"
          >
            {lang === "vn" ? "Mật khẩu" : "Password"}
          </label>
          <div className={inputShell}>
            <Lock className="w-4 h-4 ml-3.5 text-white/35 shrink-0" />
            <input
              id="portal-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputInner}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={
                showPassword
                  ? lang === "vn"
                    ? "Ẩn mật khẩu"
                    : "Hide password"
                  : lang === "vn"
                    ? "Hiện mật khẩu"
                    : "Show password"
              }
              className="px-3.5 text-white/40 hover:text-cyan-300 transition-colors cursor-pointer shrink-0"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full h-11 rounded-xl font-bold text-sm text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          style={{
            background: "var(--gradient-primary)",
            boxShadow: "var(--shadow-glow)",
          }}
        >
          <LogIn className="w-4 h-4" />
          <span>
            {lang === "vn" ? "Đăng nhập Văn phòng số" : "Sign in to Portal"}
          </span>
        </button>

        <p className="text-[11px] text-center text-muted-foreground leading-relaxed">
          {lang === "vn"
            ? "Bản demo — tài khoản mẫu đã điền sẵn,"
            : "Demo build — the sample account is prefilled,"}
          <br className="hidden sm:block" />{" "}
          {lang === "vn"
            ? "bấm đăng nhập để trải nghiệm toàn bộ chức năng."
            : "just sign in to explore every panel."}
          <br />
          {lang === "vn" ? (
            <>
              Nhập{" "}
              <span className="font-mono text-white/60">
                admin@gmail.com / admin
              </span>{" "}
              để vào thẳng trang quản trị.
            </>
          ) : (
            <>
              Enter{" "}
              <span className="font-mono text-white/60">
                admin@gmail.com / admin
              </span>{" "}
              to jump straight to the admin area.
            </>
          )}
        </p>
      </form>

      {/* Enrollment cross-link */}
      <div className="mt-6 pt-5 border-t border-white/8">
        <p className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground text-center mb-3">
          {lang === "vn" ? "Chưa là hội viên DTA?" : "Not a DTA member yet?"}
        </p>
        <Link
          to="/portal/dang-ky"
          className="w-full h-11 rounded-xl text-sm font-bold border border-accent/40 text-accent hover:bg-accent/10 hover:border-accent/70 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>
            {lang === "vn"
              ? "Đăng ký gia nhập Hiệp hội"
              : "Apply for Membership"}
          </span>
        </Link>
      </div>
    </div>
  );
}
