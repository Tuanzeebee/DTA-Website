import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminShell } from "@/compenents/admin/AdminShell";

/**
 * /admin/* — editorial dashboard ("trình quản trị nội dung" in the plan).
 * Everything admin-specific lives in src/compenents/admin/. The shell holds
 * the demo session gate; child routes render inside it.
 */
export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
