import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  Users,
  Newspaper,
  LogOut,
  ShieldCheck,
  ExternalLink,
  Wallet,
  BookOpen,
  MessagesSquare,
  Inbox,
} from "lucide-react";
import { useAdminAuth, DEMO_PASSWORD } from "@/compenents/admin/adminStore";
import { forumStore, applicationStore } from "@/compenents/admin/opsData";

/**
 * Chrome for every /admin page: session gate + sidebar + topbar. Deliberately
 * plainer than the public site — flat dark surface, no aurora — so editors
 * always know which side they're on.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const { isAuthed, login, logout } = useAdminAuth();

  if (!isAuthed) return <LoginCard onLogin={login} />;

  return (
    <div className="min-h-dvh bg-[oklch(0.12_0.03_265)] text-white flex">
      <Sidebar onLogout={logout} />
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-14 shrink-0 border-b border-white/10 bg-white/[0.02] flex items-center justify-between px-4 md:px-6">
          <span className="text-sm font-bold text-white/80">
            Trang quản trị DTA News
          </span>
          <Link
            to="/news"
            className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-accent hover:text-cyan-300 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Xem trang tin
          </Link>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

const NAV = [
  { to: "/admin", label: "Tổng quan", icon: LayoutDashboard, exact: true },
  { to: "/admin/bai-viet", label: "Bài viết", icon: FileText, exact: false },
  { to: "/admin/hoi-vien", label: "Hội viên", icon: Users, exact: false },
  {
    to: "/admin/hoi-phi",
    label: "Hội phí & Tài chính",
    icon: Wallet,
    exact: false,
  },
  {
    to: "/admin/tai-nguyen",
    label: "Ấn phẩm & Tài nguyên",
    icon: BookOpen,
    exact: false,
  },
  {
    to: "/admin/phan-bien",
    label: "Diễn đàn phản biện",
    icon: MessagesSquare,
    exact: false,
  },
  {
    to: "/admin/dang-ky",
    label: "Đăng ký hội viên",
    icon: Inbox,
    exact: false,
  },
] as const;

function Sidebar({ onLogout }: { onLogout: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

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
        {NAV.map((item) => {
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

      <button
        onClick={onLogout}
        className="m-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-bold text-white/50 hover:text-red-300 hover:bg-white/5 transition-colors cursor-pointer"
      >
        <LogOut className="w-4 h-4 shrink-0" />
        <span className="hidden lg:block">Đăng xuất</span>
      </button>
    </aside>
  );
}

function LoginCard({ onLogin }: { onLogin: (password: string) => boolean }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  return (
    <div className="min-h-dvh bg-[oklch(0.12_0.03_265)] text-white flex items-center justify-center p-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!onLogin(password)) setError(true);
        }}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-8"
      >
        <div className="flex items-center gap-2.5 mb-1">
          <ShieldCheck className="w-6 h-6 text-accent" />
          <h1 className="text-lg font-black uppercase tracking-wide">
            DTA Admin
          </h1>
        </div>
        <p className="text-xs text-white/50 mb-6">
          Khu vực dành cho Ban Biên tập. Phiên đăng nhập demo — tài khoản thật
          sẽ nối vào backend sau.
        </p>

        <label className="block text-[10px] uppercase tracking-wider text-white/60 font-bold mb-1.5">
          Mật khẩu
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          autoFocus
          className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400/60"
        />
        {error && (
          <p className="mt-2 text-[11px] text-red-300">
            Mật khẩu chưa đúng — bản demo dùng “{DEMO_PASSWORD}”.
          </p>
        )}

        <button
          type="submit"
          className="mt-5 w-full py-2.5 rounded-xl text-sm font-bold text-primary-foreground hover:opacity-90 active:scale-98 transition-all cursor-pointer"
          style={{
            background: "var(--gradient-primary)",
            boxShadow: "var(--shadow-glow)",
          }}
        >
          Đăng nhập
        </button>
        <p className="mt-3 text-center text-[10px] text-white/35">
          Demo: mật khẩu “{DEMO_PASSWORD}”
        </p>
      </form>
    </div>
  );
}
