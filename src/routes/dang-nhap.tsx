import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowLeft, Newspaper } from "lucide-react";
import { useLang, useSession } from "@/hooks/useLang";
import { LoginCard } from "@/compenents/member/LoginCard";
import { ROLE_LABEL } from "@/lib/auth/permissions";
import type { AdminUser } from "@/lib/auth/types";

/**
 * Standalone sign-in page. The admin route guard redirects here with
 * ?redirect=<where you were heading>; the same card also serves the member
 * portal flow, so one submit handler routes each outcome where it belongs.
 */
export const Route = createFileRoute("/dang-nhap")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  component: DangNhapPage,
});

function DangNhapPage() {
  const { lang } = useLang();
  const { handleLogin } = useSession(lang);
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();

  /** Only same-app absolute paths are honoured as post-login targets. */
  const safeRedirect =
    redirect && redirect.startsWith("/") && !redirect.startsWith("//")
      ? redirect
      : "/admin";

  const handleAdminLogin = (user: AdminUser) => {
    toast.success(
      lang === "vn"
        ? `Đăng nhập thành công — ${ROLE_LABEL[user.role]} ${user.name}.`
        : `Signed in as ${ROLE_LABEL[user.role]} (${user.name}).`,
    );
    navigate({ href: safeRedirect });
  };

  const handleMemberLogin = () => {
    handleLogin(true);
    navigate({ to: "/portal" });
  };

  return (
    <div className="min-h-dvh bg-[oklch(0.12_0.03_160)] flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-5">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center shrink-0">
            <Newspaper className="w-5 h-5 text-accent" />
          </span>
          <div>
            <p className="font-black uppercase tracking-wider text-sm text-white leading-tight">
              DTA News
            </p>
            <p className="text-[11px] text-white/50 mt-0.5">
              {lang === "vn"
                ? "Đăng nhập một điểm — portal hội viên hoặc trang quản trị."
                : "One sign-in — member portal or the admin area."}
            </p>
          </div>
          <Link
            to="/news"
            className="ml-auto flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-white/40 hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {lang === "vn" ? "Trang tin" : "News"}
          </Link>
        </div>

        <LoginCard
          lang={lang}
          onLogin={handleMemberLogin}
          onAdminLogin={handleAdminLogin}
        />
      </div>
    </div>
  );
}
