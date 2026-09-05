import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  CreditCard,
  FileText,
  MessageSquare,
  LogOut,
  ShieldCheck,
  FileCheck,
  BadgeCheck,
  Handshake,
} from "lucide-react";
import { useLang, useSession } from "@/hooks/useLang";
import { LoginCard } from "@/compenents/member/LoginCard";
import { authService } from "@/lib/auth/service";
import type { AdminUser } from "@/lib/auth/types";
import { ROLE_LABEL } from "@/lib/auth/permissions";
import { MemberCard } from "@/compenents/member/MemberCard";
import {
  ProfilePanel,
  type ProfileData,
} from "@/compenents/member/panels/ProfilePanel";
import { FinancePanel } from "@/compenents/member/panels/FinancePanel";
import { ResourcesPanel } from "@/compenents/member/panels/ResourcesPanel";
import { ForumPanel } from "@/compenents/member/panels/ForumPanel";
import { TrongDongDisc } from "@/compenents/TrongDongDisc";

export const Route = createFileRoute("/portal/")({
  component: PortalIndex,
});

type TabId = "profile" | "finance" | "resources" | "forum";

function PortalIndex() {
  const { lang } = useLang();
  const { isLoggedIn, handleLogin } = useSession(lang);
  const navigate = useNavigate();

  /* Admin/Editor credentials: redirect to /admin */
  const handleAdminLogin = (user: AdminUser) => {
    toast.success(
      lang === "vn"
        ? `Đăng nhập quản trị thành công — ${ROLE_LABEL[user.role]}.`
        : `Signed in as ${ROLE_LABEL[user.role]}!`,
    );
    navigate({ to: "/admin" });
  };

  return (
    <main className="flex-grow pt-28 md:pt-32 pb-20 px-4 md:px-6 relative">
      <AnimatePresence mode="wait">
        {isLoggedIn ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
          >
            <Dashboard lang={lang} onLogout={() => handleLogin(false)} />
          </motion.div>
        ) : (
          <motion.div
            key="lobby"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
          >
            <Lobby
              lang={lang}
              onAdminLogin={handleAdminLogin}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* LOGGED-OUT — the "lobby": brand pitch left, sign-in card right.     */
/* ------------------------------------------------------------------ */

function Lobby({
  lang,
  onAdminLogin,
}: {
  lang: "vn" | "en";
  onAdminLogin: (user: AdminUser) => void;
}) {
  const perks = [
    {
      icon: BadgeCheck,
      text:
        lang === "vn"
          ? "Hồ sơ năng lực trong danh bạ Hội viên toàn Hiệp hội"
          : "Capability profile in the association-wide directory",
    },
    {
      icon: CreditCard,
      text:
        lang === "vn"
          ? "Giám sát thu chi quỹ công khai, theo thở gian thực"
          : "Real-time oversight of the transparent fund ledger",
    },
    {
      icon: FileText,
      text:
        lang === "vn"
          ? "Ấn phẩm & nghiên cứu vi mạch lưu hành nội bộ"
          : "Internal semiconductor research and publications",
    },
    {
      icon: MessageSquare,
      text:
        lang === "vn"
          ? "Đường dây phản biện trực tiếp tới chính quyền thành phố"
          : "A direct policy-feedback line to the city government",
    },
  ];

  const steps = [
    {
      t: lang === "vn" ? "Nộp hồ sơ trực tuyến" : "Apply online",
      d:
        lang === "vn"
          ? "Khai báo pháp nhân & định hướng công nghệ trong 5 phút."
          : "Declare legal status and tech focus in five minutes.",
    },
    {
      t: lang === "vn" ? "Thẩm tra trong 30 ngày" : "30-day review",
      d:
        lang === "vn"
          ? "Ban Thư ký xác thực và trình Ban Chấp hành thông qua."
          : "The Secretariat verifies and the Executive Board approves.",
    },
    {
      t: lang === "vn" ? "Nhận Thẻ Hội viên số" : "Receive your digital card",
      d:
        lang === "vn"
          ? "Tài khoản Văn phòng số và thẻ ID mã QR được kích hoạt."
          : "Your Digital Office account and QR member ID go live.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-14 items-center relative">
      {/* Ambient bronze drum behind the pitch — the association's emblem,
          kept faint so the form stays the loudest thing on the right.
          Anchored so the WHOLE disc stays inside main's box: the bottom edge
          rides main's pb-20 zone and the left edge hides in the viewport
          gutter, so the full circle shows with zero page-height growth (and
          therefore a single scrollbar — PageShell's overflow-x-clip quietly
          absorbs whatever still pokes out on narrower lg screens).
          NB: the disc root carries `relative`, so the absolute positioning
          must live on this wrapper — passing it down would clash in the
          cascade and the disc would join the grid as a static item. */}
      <div
        aria-hidden
        className="hidden lg:block absolute -left-32 -bottom-20 w-[440px] h-[440px] opacity-30 pointer-events-none select-none"
      >
        <TrongDongDisc className="w-full h-full" />
      </div>

      {/* Left: pitch */}
      <div className="relative">
        <p className="text-[11px] md:text-xs tracking-[0.25em] font-bold text-accent uppercase mb-4">
          {lang === "vn"
            ? "Cổng Hội viên · Văn phòng số DTA"
            : "Member Portal · DTA Digital Office"}
        </p>
        <h1 className="display text-3xl sm:text-4xl md:text-5xl font-black leading-[1.25] text-white">
          {lang === "vn" ? "Văn phòng số" : "The Digital Office"}
          <br />
          <span className="text-gradient-gold">
            {lang === "vn" ? "của Hội viên DTA" : "for DTA Members"}
          </span>
        </h1>
        <p className="mt-5 text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl">
          {lang === "vn"
            ? "Một điểm chạm duy nhất: quản lý hồ sơ doanh nghiệp, theo dõi hội phí công khai, truy cập tài nguyên nội bộ và gửi phản biện chính sách — dân chủ, minh bạch, tự động."
            : "One touchpoint: manage your company profile, track transparent dues, access internal resources, and file policy feedback — democratic, transparent, automated."}
        </p>

        {/* Membership perks */}
        <ul className="mt-8 grid sm:grid-cols-2 gap-x-6 gap-y-4">
          {perks.map((perk) => (
            <li key={perk.text} className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary/12 border border-primary/25 flex items-center justify-center shrink-0 mt-0.5">
                <perk.icon className="w-4 h-4 text-cyan-300" />
              </span>
              <span className="text-[13px] text-white/80 leading-relaxed">
                {perk.text}
              </span>
            </li>
          ))}
        </ul>

        {/* Enrollment timeline */}
        <div className="mt-10 pt-8 border-t border-white/8">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-5 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent" />
            {lang === "vn" ? "Lộ trình gia nhập" : "Path to Membership"}
          </p>
          <ol className="grid sm:grid-cols-3 gap-5">
            {steps.map((step, i) => (
              <li key={step.t} className="relative">
                <span className="font-mono text-xs font-black text-accent tracking-widest">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  aria-hidden
                  className="hidden sm:block absolute top-1.5 left-10 right-2 h-px bg-gradient-to-r from-accent/30 to-transparent"
                />
                <h4 className="text-[13px] font-bold text-white mt-2">
                  {step.t}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                  {step.d}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Right: sign-in */}
      <LoginCard lang={lang} onAdminLogin={onAdminLogin} onMemberLogin={() => {}} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* LOGGED-IN — the "desk": member card strip + sidebar workspace.      */
/* ------------------------------------------------------------------ */

const INITIAL_PROFILE: ProfileData = {
  companyName: "",
  representative: "",
  techStack: "",
  website: "",
  staffCount: "",
};

function Dashboard({
  lang,
  onLogout,
}: {
  lang: "vn" | "en";
  onLogout: () => void;
}) {
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [profileData, setProfileData] = useState<ProfileData>(INITIAL_PROFILE);

  const tabs: {
    id: TabId;
    icon: typeof User;
    label: string;
    hint: string;
  }[] = [
    {
      id: "profile",
      icon: User,
      label: lang === "vn" ? "Hồ sơ Hội viên" : "My Profile",
      hint: lang === "vn" ? "Năng lực doanh nghiệp" : "Capability record",
    },
    {
      id: "finance",
      icon: CreditCard,
      label: lang === "vn" ? "Hội phí & Tài chính" : "Fees & Ledger",
      hint: lang === "vn" ? "Thu chi công khai" : "Transparent fund",
    },
    {
      id: "resources",
      icon: FileText,
      label: lang === "vn" ? "Ấn phẩm & Tài nguyên" : "Publications",
      hint: lang === "vn" ? "Lưu hành nội bộ" : "Members-only library",
    },
    {
      id: "forum",
      icon: MessageSquare,
      label: lang === "vn" ? "Diễn đàn phản biện" : "Policy Forum",
      hint: lang === "vn" ? "Kiến nghị chính sách" : "Propose & review",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Identity strip: the digital member card + workspace controls */}
      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6 items-stretch">
        <MemberCard
          lang={lang}
          companyName={profileData.companyName}
          representative={profileData.representative}
          memberId=""
        />

        <div className="card-surface rounded-2xl p-6 flex flex-col justify-between gap-6">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              {lang === "vn" ? "Bàn làm việc Hội viên" : "Member Workspace"}
            </p>
            <h1 className="display text-xl md:text-2xl font-black text-white mt-2 leading-snug">
              {lang === "vn" ? "Xin chào," : "Welcome back,"}{" "}
              <span className="text-gradient-cyan">
                {profileData.representative}
              </span>
            </h1>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              {lang === "vn"
                ? "Văn phòng số đang kết nối. Mọi thao tác hồ sơ, hội phí và phản biện đều được ghi nhận công khai."
                : "Your Digital Office is connected. Every profile, fee and feedback action is recorded openly."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/12 border border-emerald-500/25 text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
              <FileCheck className="w-3.5 h-3.5" />
              {lang === "vn" ? "Hồ sơ đã xác thực" : "Verified profile"}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/25 text-accent text-[11px] font-bold uppercase tracking-wider">
              <Handshake className="w-3.5 h-3.5" />
              {lang === "vn" ? "Hội viên từ 2024" : "Member since 2024"}
            </span>
            <button
              onClick={onLogout}
              className="ml-auto px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider border border-white/10 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer text-muted-foreground"
            >
              <LogOut className="w-3.5 h-3.5" />
              {lang === "vn" ? "Đăng xuất" : "Sign Out"}
            </button>
          </div>
        </div>
      </div>

      {/* Workspace: sidebar + panel */}
      <div className="card-surface rounded-3xl overflow-hidden grid md:grid-cols-[240px_1fr]">
        {/* Sidebar — horizontal scrollable strip on mobile */}
        <div className="bg-white/[0.02] md:border-r border-b md:border-b-0 border-white/6 p-3 md:p-4 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                aria-current={active ? "page" : undefined}
                className={`relative shrink-0 md:shrink md:w-full px-4 py-3 rounded-xl text-left transition-all cursor-pointer flex md:block items-center gap-2.5 ${
                  active
                    ? "bg-white/[0.07] text-white"
                    : "text-muted-foreground hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                {/* Active rail */}
                <span
                  aria-hidden
                  className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-full bg-[linear-gradient(180deg,var(--gradient-gold))] transition-all duration-300 ${
                    active ? "h-3/5 opacity-100" : "h-0 opacity-0"
                  }`}
                  style={
                    active ? { background: "var(--gradient-gold)" } : undefined
                  }
                />
                <tab.icon
                  className={`w-4 h-4 shrink-0 md:inline-block md:mr-2.5 md:-mt-0.5 ${
                    active ? "text-accent" : ""
                  }`}
                />
                <span className="text-[13px] font-bold whitespace-nowrap">
                  {tab.label}
                </span>
                <span className="hidden md:block text-[10px] text-muted-foreground mt-0.5 pl-7 whitespace-nowrap">
                  {tab.hint}
                </span>
              </button>
            );
          })}
        </div>

        {/* Panel */}
        <div className="p-6 md:p-8 min-h-[480px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {activeTab === "profile" && (
                <ProfilePanel
                  lang={lang}
                  data={profileData}
                  onChange={setProfileData}
                />
              )}
              {activeTab === "finance" && <FinancePanel lang={lang} />}
              {activeTab === "resources" && <ResourcesPanel lang={lang} />}
              {activeTab === "forum" && <ForumPanel lang={lang} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
