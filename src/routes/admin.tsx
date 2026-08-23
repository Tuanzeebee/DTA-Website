import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AdminShell } from "@/compenents/admin/AdminShell";
import { authService } from "@/lib/auth/service";

/**
 * /admin/* — editorial dashboard ("trình quản trị nội dung" in the plan).
 * Everything admin-specific lives in src/compenents/admin/. The route guard
 * handles authentication (no session → sign-in page, remembering where the
 * user was heading); per-section authorization happens inside each child
 * route via <RequireSection>, and AdminShell shapes the chrome by role.
 */
export const Route = createFileRoute("/admin")({
  beforeLoad: ({ location }) => {
    if (!authService.currentSession()) {
      throw redirect({
        to: "/dang-nhap",
        search: { redirect: location.href },
      });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
