import { useCallback, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  LayoutDashboard,
  FileText,
  Users,
  Newspaper,
  LogOut,
  ExternalLink,
  Wallet,
  BookOpen,
  MessagesSquare,
  Inbox,
  Megaphone,
  UserCog,
} from "lucide-react";
import { forumStore, applicationStore } from "@/compenents/admin/opsData";
import { useAuthSession, useLogout } from "@/lib/auth/useAuth";
import {
  ROLE_LABEL,
  canAccess,
  type AdminSection,
} from "@/lib/auth/permissions";

/**
 * Chrome for every /admin page: sidebar + topbar, shaped by the signed-in
 * user's role (see lib/auth/permissions). Deliberately plainer than the
 * public site — flat dark surface, no aurora — so editors always know which
 * side they're on. Authentication itself is enforced by the route guard;
 * this shell assumes a session exists.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const session = useAuthSession();
  const logout = useLogout();
  const navigate = useNavigate();

  /* Signing out must also LEAVE the admin area: the route guard only runs
     on navigation, so clearing the session alone would leave the current
     page mounted (rendering its Forbidden gate). Off to /portal instead. */
  const handleLogout = useCallback(() => {
    logout();
    toast.success("Đã đăng xuất khỏi hệ thống.");
    navigate({ to: "/portal" });
  }, [logout, navigate]);

  return (
    <div className="min-h-dvh bg-[oklch(0.12_0.03_160)] text-white flex">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-14 shrink-0 border-b border-white/10 bg-white/[0.02] flex items-center justify-between gap-3 px-4 md:px-6">
          <span className="text-sm font-bold text-white/80">
            Trang quản trị DTA News
          </span>
          <div className="flex items-center gap-2 md:gap-4">
            <Link
              to="/news"
              className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-accent hover:text-cyan-300 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Xem trang tin</span>
            </Link>
            {session && <UserChip name={session.name} role={session.role} />}
            <button
              onClick={handleLogout}
              title="Đăng xuất"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/10 text-[11px] font-bold text-white/50 hover:text-red-300 hover:border-red-400/30 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Đăng xuất</span>
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

function UserChip({
  name,
  role,
}: {
  name: string;
  role: keyof typeof ROLE_LABEL;
}) {
  const initials =
    name
      .split(/\s+/)
      .slice(-2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "DTA";
  return (
    <div
      className="flex items-center gap-2.5"
      title={`${name} — ${ROLE_LABEL[role]}`}
    >
      <div className="hidden md:flex flex-col items-end leading-tight">
        <span className="text-xs font-bold text-white/85 max-w-[160px] truncate">
          {name}
        </span>
        <span className="text-[9px] font-black uppercase tracking-wider text-accent">
          {ROLE_LABEL[role]}
        </span>
      </div>
      <span className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-[10px] font-black text-white/80 shrink-0">
        {initials}
      </span>
    </div>
  );
}

type NavItem = {
  to: string;
  section: AdminSection;
  label: string;
  icon: typeof LayoutDashboard;
  exact: boolean;
};

const NAV: NavItem[] = [
  {
    to: "/admin",
    section: "overview",
    label: "Tổng quan",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    to: "/admin/bai-viet",
    section: "articles",
    label: "Bài viết",
    icon: FileText,
    exact: false,
  },
  {
    to: "/admin/quang-cao",
    section: "ads",
    label: "Thêm quảng cáo",
    icon: Megaphone,
    exact: false,
  },
  {
    to: "/admin/hoi-vien",
    section: "members",
    label: "Hội viên",
    icon: Users,
    exact: false,
  },
  {
    to: "/admin/hoi-phi",
    section: "fees",
    label: "Hội phí & Tài chính",
    icon: Wallet,
    exact: false,
  },
  {
    to: "/admin/tai-nguyen",
    section: "resources",
    label: "Ấn phẩm & Tài nguyên",
    icon: BookOpen,
    exact: false,
  },
  {
    to: "/admin/phan-bien",
    section: "forum",
    label: "Diễn đàn phản biện",
    icon: MessagesSquare,
    exact: false,
  },
  {
    to: "/admin/dang-ky",
    section: "applications",
    label: "Đăng ký hội viên",
    icon: Inbox,
    exact: false,
  },
  {
    to: "/admin/nguoi-dung",
    section: "users",
    label: "Người dùng & Quyền",
    icon: UserCog,
    exact: false,
  },
];

function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const session = useAuthSession();
  const role = session?.role ?? "editor";

  /* Only the sections this role may open appear in the nav at all. */
  const items = NAV.filter((item) => canAccess(role, item.section));

  /* Notification badges: pending counts surface in the nav so the editor
     sees new submissions/applications without opening each page. */
  const pendingForum = forumStore
    .useItems()
    .filter((s) => s.status === "pending").length;
  const pendingApps = applicationStore
    .useItems()
    .filter((a) => a.status === "pending").length;
  const badges: Record<string, number> = {
    "/admin/phan-bien": pendingForum,
    "/admin/dang-ky": pendingApps,
  };

  return (
    <aside className="w-14 lg:w-56 shrink-0 border-r border-white/10 bg-white/[0.02] flex flex-col">
      <div className="h-14 flex items-center gap-2 px-4 border-b border-white/10">
        <Newspaper className="w-5 h-5 text-accent shrink-0" />
        <span className="hidden lg:block font-black uppercase tracking-wider text-sm">
          DTA Admin
        </span>
      </div>

      <nav className="flex-1 py-3 space-y-1 px-2">
        {items.map((item) => {
          const active = item.exact
            ? pathname === item.to
            : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-bold transition-colors ${
                active
                  ? "bg-accent/15 text-accent"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="relative shrink-0">
                <item.icon className="w-4 h-4" />
                {/* Dot on collapsed sidebar so the count is never missed. */}
                {(badges[item.to] ?? 0) > 0 && (
                  <span className="lg:hidden absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />
                )}
              </div>
              <span className="hidden lg:block flex-1 leading-tight">
                {item.label}
              </span>
              {(badges[item.to] ?? 0) > 0 && (
                <span className="hidden lg:inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black">
                  {badges[item.to]}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {session && (
        <p className="hidden lg:block px-4 pb-2 text-[9px] uppercase tracking-wider text-white/30 font-bold">
          Đăng nhập với vai trò{" "}
          <span className="text-accent">{ROLE_LABEL[session.role]}</span>
        </p>
      )}
    </aside>
  );
}
