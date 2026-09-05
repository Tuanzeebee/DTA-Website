import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import {
  UserPlus,
  Pencil,
  Trash2,
  Lock,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import type { AdminRole, AdminUser } from "@/lib/auth/types";
import { ROLE_LABEL } from "@/lib/auth/permissions";
import { mapBackendRole } from "@/lib/auth/types";
import {
  adminFetchUsers,
  adminDeleteUser,
  adminSetUserRoles,
  adminSetUserStatus,
} from "@/lib/api";
import { useAuthSession } from "@/lib/auth/useAuth";
import { RequireSection } from "@/compenents/admin/SectionGate";
import { UserEditor } from "@/compenents/admin/UserEditor";

export const Route = createFileRoute("/admin/nguoi-dung")({
  component: () => (
    <RequireSection section="users">
      <AdminUsers />
    </RequireSection>
  ),
});

const activeAdminCount = (users: AdminUser[]) =>
  users.filter((u) => u.role === "admin" && !u.disabled).length;

const isLastActiveAdmin = (users: AdminUser[], target: AdminUser) =>
  target.role === "admin" && !target.disabled && activeAdminCount(users) <= 1;

function AdminUsers() {
  const session = useAuthSession();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AdminUser | "new" | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminFetchUsers();
      const mapped: AdminUser[] = data.map((u) => ({
        id: u.id,
        name: u.fullName,
        email: u.email,
        role: mapBackendRole(u.roles) as AdminRole,
        password: "",
        disabled: u.status !== "ACTIVE",
      }));
      setUsers(mapped);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi tải danh sách";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const remove = async (user: AdminUser) => {
    if (session && user.id === session.userId) {
      toast.error("Bạn không thể xóa tài khoản đang đăng nhập.");
      return;
    }
    if (isLastActiveAdmin(users, user)) {
      toast.error(
        "Không thể xóa Quản trị viên hoạt động cuối cùng — hãy nâng quyền một tài khoản khác trước.",
      );
      return;
    }
    if (
      !window.confirm(
        `Xóa tài khoản "${user.name}" (${user.email})?\n\nHành động này không thể hoàn tác.`,
      )
    )
      return;
    try {
      await adminDeleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      if (editing !== null && editing !== "new" && editing.id === user.id)
        setEditing(null);
      toast.success("Đã xóa tài khoản.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi xóa tài khoản";
      toast.error(msg);
    }
  };

  const handleSave = (next: AdminUser) => {
    if (editing === "new") {
      setUsers((prev) => [next, ...prev]);
    } else {
      setUsers((prev) => prev.map((u) => (u.id === next.id ? next : u)));
    }
    setEditing(null);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-wrap items-center gap-3">
        <div className="mr-auto">
          <h1 className="text-xl font-black text-white">
            Người dùng & Phân quyền
          </h1>
          <p className="mt-1 text-xs text-white/50 max-w-2xl leading-relaxed">
            Danh bạ tài khoản quản trị và vai trò RBAC. Biên tập viên thấy nội
            dung (bài viết, phản biện, quảng cáo, tài nguyên); tài khoản Hội
            viên chỉ đăng nhập vào Portal hội viên; Quản trị viên toàn quyền.
          </p>
        </div>
        <button
          onClick={() => setEditing("new")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold text-primary-foreground hover:opacity-90 transition-all cursor-pointer"
          style={{
            background: "var(--gradient-primary)",
            boxShadow: "var(--shadow-glow)",
          }}
        >
          <UserPlus className="w-3.5 h-3.5" />
          Thêm tài khoản
        </button>
      </div>

      {editing !== null && (
        <UserEditor
          key={editing === "new" ? "new" : editing.id}
          initial={editing === "new" ? undefined : editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-white/40 gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-xs">Đang tải danh sách...</span>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[680px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03] text-[10px] uppercase tracking-wider text-white/50">
                <th className="px-4 py-3 font-bold">Người dùng</th>
                <th className="px-4 py-3 font-bold">Vai trò</th>
                <th className="px-4 py-3 font-bold">Trạng thái</th>
                <th className="px-4 py-3 font-bold text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => {
                const isSelf = session?.userId === user.id;
                return (
                  <tr key={user.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-[10px] font-black text-white/80 shrink-0">
                          {user.name
                            .split(/\s+/)
                            .slice(-2)
                            .map((w) => w[0])
                            .join("")
                            .toUpperCase()}
                        </span>
                        <div className="min-w-0 max-w-[260px]">
                          <div className="font-bold text-white/90 truncate flex items-center gap-1.5">
                            {user.name}
                            {isSelf && (
                              <span className="text-[9px] font-black uppercase tracking-wider text-cyan-300 bg-cyan-500/15 px-1.5 py-0.5 rounded-md">
                                bạn
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-white/40 font-mono truncate">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 font-bold">
                        <ShieldCheck
                          className={`w-3.5 h-3.5 ${
                            user.role === "admin"
                              ? "text-accent"
                              : user.role === "editor"
                                ? "text-emerald-300"
                                : "text-sky-300"
                          }`}
                        />
                        {ROLE_LABEL[user.role]}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {user.disabled ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/15 text-red-300 text-[9px] font-black uppercase tracking-wider">
                          <Lock className="w-3 h-3" />
                          Bị khóa
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 text-[9px] font-black uppercase tracking-wider">
                          Hoạt động
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditing(user)}
                          title="Sửa tài khoản"
                          className="p-1.5 rounded-lg border border-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => remove(user)}
                          title="Xóa tài khoản"
                          className="p-1.5 rounded-lg border border-white/10 text-white/50 hover:text-red-300 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-[10px] text-white/35 leading-relaxed max-w-2xl">
        Dữ liệu người dùng được lấy từ backend NestJS. Phân quyền dựa trên
        JWT token và hệ thống RBAC với 6 vai trò backend (SUPER_ADMIN, ADMIN,
        EDITOR, AUTHOR, MEMBER, USER).
      </p>
    </div>
  );
}
