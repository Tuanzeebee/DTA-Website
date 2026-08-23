import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ShieldX } from "lucide-react";
import { useCan, useAuthSession } from "@/lib/auth/useAuth";
import { ROLE_LABEL, type AdminSection } from "@/lib/auth/permissions";

/**
 * Authorization gate rendered INSIDE the admin shell (the shell itself only
 * checks authentication). Wrong role → a Forbidden panel instead of the
 * page content; right role → children untouched.
 */
export function RequireSection({
  section,
  children,
}: {
  section: AdminSection;
  children: ReactNode;
}) {
  const allowed = useCan(section);
  if (!allowed) return <Forbidden />;
  return <>{children}</>;
}

function Forbidden() {
  const session = useAuthSession();
  return (
    <div className="max-w-md mx-auto mt-16 text-center">
      <span className="inline-flex w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/25 items-center justify-center mb-5">
        <ShieldX className="w-7 h-7 text-red-300" />
      </span>
      <h1 className="text-xl font-black text-white">Không có quyền truy cập</h1>
      <p className="mt-2 text-xs text-white/50 leading-relaxed">
        Khu vực này không nằm trong phạm vi của vai trò{" "}
        <span className="font-bold text-white/80">
          {session ? ROLE_LABEL[session.role] : "hiện tại"}
        </span>
        . Liên hệ Quản trị viên nếu bạn cần quyền truy cập.
      </p>
      <Link
        to="/admin"
        className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold text-primary-foreground hover:opacity-90 transition-all"
        style={{
          background: "var(--gradient-primary)",
          boxShadow: "var(--shadow-glow)",
        }}
      >
        Về trang Tổng quan
      </Link>
    </div>
  );
}
