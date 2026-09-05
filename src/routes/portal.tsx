import { createFileRoute, Outlet, Link, redirect } from "@tanstack/react-router";
import { PageShell } from "@/compenents/layout/PageShell";
import { PortalHeader } from "@/compenents/member/PortalHeader";
import { useLang } from "@/hooks/useLang";
import { authService } from "@/lib/auth/service";

/**
 * Member-portal layout: shared chrome for /portal and /portal/dang-ky —
 * the fixed header, the ambient page shell, and a compact footer. Child
 * routes render in <Outlet />; each brings its own main content.
 *
 * Admin/Editor users are redirected to /admin — the portal is for members only.
 */
export const Route = createFileRoute("/portal")({
  beforeLoad: () => {
    const role = authService.getRole();
    if (role === "admin" || role === "editor") {
      throw redirect({ to: "/admin" });
    }
  },
  component: PortalLayout,
});

function PortalLayout() {
  const { lang } = useLang();

  return (
    <PageShell className="flex flex-col">
      <PortalHeader />

      <div className="flex-grow flex flex-col">
        <Outlet />
      </div>

      <footer className="border-t border-white/10 py-6 px-6 bg-black/40 text-center text-[11px] text-muted-foreground">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>
            © 2026 Danang Digital Technology Association (DTA). All rights
            reserved.
          </span>
          <div className="flex gap-4">
            <Link to="/" className="hover:text-white transition-colors">
              {lang === "vn" ? "Trang chủ" : "Home"}
            </Link>
            <span aria-hidden>·</span>
            <span>
              {lang === "vn"
                ? "Trụ sở: Tòa nhà 15 Quang Trung, Hải Châu, Đà Nẵng"
                : "HQ: 15 Quang Trung, Hai Chau, Danang"}
            </span>
          </div>
        </div>
      </footer>
    </PageShell>
  );
}
