import { createFileRoute, Link } from "@tanstack/react-router";
import { useLang, useSession } from "@/hooks/useLang";
import { useScrolled } from "@/hooks/useScrolled";
import { PageShell } from "@/compenents/layout/PageShell";
import { SectionHeader } from "@/compenents/SectionHeader";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import {
  LogIn,
  LogOut,
  User,
  CreditCard,
  FileText,
  MessageSquare,
  Plus,
  Check,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileDown,
  Download,
  Send,
  ChevronRight,
  ShieldCheck,
  ArrowLeft,
  Globe,
  Building,
} from "lucide-react";

export const Route = createFileRoute("/portal")({
  component: PortalPage,
});

function PortalPage() {
  const { lang, toggleLang } = useLang();
  const { isLoggedIn, handleLogin } = useSession(lang);
  const [activeTab, setActiveTab] = useState<
    "profile" | "finance" | "resources" | "forum" | "register"
  >("profile");
  const scrolled = useScrolled();

  // Portal form states
  const [profileData, setProfileData] = useState({
    companyName: "Công ty Cổ phần Công nghệ Số Đà Nẵng",
    representative: "Nguyễn Văn Trọng",
    techStack: "Trí tuệ nhân tạo (AI), IoT & Thiết kế vi mạch nhúng",
    website: "https://danangtech.vn",
    staffCount: "45",
  });

  // Forum feedback state
  const [feedbackText, setFeedbackText] = useState("");
  const [category, setCategory] = useState("policy");
  const [feedbacks, setFeedbacks] = useState([
    {
      id: 1,
      author: "Hội viên BAP IT",
      date: "14/07/2026",
      text: "Kiến nghị thành phố có chính sách miễn giảm 50% tiền thuê đất phòng máy chủ đặt tại Công viên phần mềm số 2 Đà Nẵng.",
      category: "Chính sách hạ tầng",
      status: "Văn phòng DTA đã chuyển giao Sở TTTT thẩm tra",
    },
    {
      id: 2,
      author: "Hội viên DUT",
      date: "05/07/2026",
      text: "Đề xuất tài trợ 100% chi phí bản quyền công cụ EDA thiết kế chip Synopsys cho các phòng Lab nghiên cứu đại học.",
      category: "Phát triển vi mạch",
      status: "Đang chờ Ban Chấp hành tổng hợp",
    },
  ]);

  // Online application form state
  const [regStep, setRegStep] = useState(1);
  const [regData, setRegData] = useState({
    orgName: "",
    representative: "",
    email: "",
    techField: "AI",
    hasLegalDoc: false,
  });
  const [registeredCode, setRegisteredCode] = useState("");

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      lang === "vn"
        ? "Cập nhật hồ sơ năng lực thành công!"
        : "Profile updated successfully!",
    );
  };

  const handlePostFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    const newPost = {
      id: Date.now(),
      author: lang === "vn" ? "Bạn (Hội viên Demo)" : "You (Demo Member)",
      date: "Hôm nay",
      text: feedbackText,
      category:
        category === "policy" ? "Phản biện chính sách" : "Hợp tác thương mại",
      status:
        lang === "vn"
          ? "Văn phòng DTA đang chờ tiếp nhận"
          : "Pending DTA Reception",
    };

    setFeedbacks([newPost, ...feedbacks]);
    setFeedbackText("");
    toast.success(
      lang === "vn"
        ? "Ý kiến đóng góp đã được gửi lên Ban Thư ký!"
        : "Feedback posted to DTA Secretariat!",
    );
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regData.orgName || !regData.email) {
      toast.error(
        lang === "vn"
          ? "Vui lòng điền các thông tin bắt buộc."
          : "Please fill in all required fields.",
      );
      return;
    }
    const randCode = "DTA-" + Math.floor(1000 + Math.random() * 9000);
    setRegisteredCode(randCode);
    setRegStep(3);
    toast.success(
      lang === "vn"
        ? "Đã nộp đơn gia nhập DTA số hóa thành công!"
        : "DTA Digital enrollment submitted!",
    );
  };

  const [showQR, setShowQR] = useState(false);

  return (
    <PageShell className="flex flex-col justify-between">
      {/* Dedicated Portal Header Nav */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass border-b"
            : "bg-transparent border-b border-transparent shadow-none"
        }`}
      >
        <div
          className={`w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-4 transition-all duration-300 ${
            scrolled ? "h-12" : "h-16"
          }`}
        >
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0 cursor-pointer -ml-1 sm:-ml-2"
          >
            <img
              src="https://dsa.org.vn/wp-content/uploads/2017/11/logoSVG_1411.svg"
              alt="DTA Logo"
              className={`transition-all duration-300 w-auto object-contain ${
                scrolled ? "h-8 md:h-9" : "h-10 md:h-12"
              }`}
              referrerPolicy="no-referrer"
            />
          </Link>

          <div className="flex items-center gap-4 whitespace-nowrap flex-nowrap shrink-0 font-['Be_Vietnam_Pro']">
            {/* Back to Home Link */}
            <Link
              to="/"
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white hover:text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer border border-white/20 whitespace-nowrap font-['Be_Vietnam_Pro']"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === "vn" ? "Trở về Trang chủ" : "Back to Home"}</span>
            </Link>

            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="px-2.5 py-1.5 rounded-xl text-[10px] font-bold text-white border border-white/20 hover:border-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 active:scale-95 transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap font-['Be_Vietnam_Pro']"
            >
              <Globe className="w-3 h-3 text-cyan-400" />
              <span>{lang === "vn" ? "EN" : "VN"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-grow pt-28 pb-16 px-6 relative flex flex-col items-center justify-center">
        <div className="w-full max-w-6xl mx-auto">
          <SectionHeader
            eyebrow={
              lang === "vn"
                ? "VĂN PHÒNG SỐ DÂN CHỦ - TỰ ĐỘNG HÓA"
                : "DTA DIGITAL OFFICE & COLLABORATIVE PORTAL"
            }
            title={
              <>
                {lang === "vn"
                  ? "Cổng Thông tin Hội viên"
                  : "Interactive Member Portal"}
                <br />
                <span className="text-gradient-gold">
                  {lang === "vn"
                    ? "Văn Phòng Số Tích Hợp"
                    : "Integrated Digital Office"}
                </span>
              </>
            }
            subtitle={
              lang === "vn"
                ? "Cá nhân hóa hành trình hội viên. Tự quản lý hồ sơ, theo dõi đóng góp tài chính công khai, truy cập tài nguyên nội bộ và đóng góp phản biện chính sách."
                : "Experience our integrated digital office. Autonomously manage company profiles, track transparent financials, access inner publications, and post policy suggestions."
            }
          />

          {!isLoggedIn ? (
            /* NOT LOGGED IN STATE - SHOW LOGIN OR ENROLLMENT */
            <div className="grid lg:grid-cols-5 gap-8 items-stretch">
              {/* Left Box: Login */}
              <div className="lg:col-span-2 glass rounded-3xl p-8 border border-white/10 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wide flex items-center gap-2">
                    <LogIn className="w-5 h-5 text-accent" />
                    <span>
                      {lang === "vn"
                        ? "Đăng nhập Cổng Hội viên"
                        : "Member Login"}
                    </span>
                  </h3>
                  <p className="text-xs text-muted-foreground mb-6">
                    {lang === "vn"
                      ? "Sử dụng tài khoản đã được Ban Thư ký cấp khi phê duyệt điều lệ tư cách pháp nhân."
                      : "Use the credentials assigned to your enterprise by the DTA secretariat upon charter approval."}
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        disabled
                        value="demomember@dta.org.vn"
                        className="w-full pl-3 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-muted-foreground focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1.5">
                        {lang === "vn" ? "Mật khẩu" : "Password"}
                      </label>
                      <input
                        type="password"
                        disabled
                        value="xxxxxxxx"
                        className="w-full pl-3 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-muted-foreground focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5">
                  <button
                    onClick={() => handleLogin(true)}
                    className="w-full py-3 rounded-xl font-bold text-xs text-primary-foreground hover:opacity-90 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    style={{
                      background: "var(--gradient-primary)",
                      boxShadow: "var(--shadow-glow)",
                    }}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>
                      {lang === "vn"
                        ? "Đăng nhập Nhanh (Hội viên Demo)"
                        : "Instant Demo Member Login"}
                    </span>
                  </button>
                  <p className="text-[10px] text-center text-muted-foreground mt-3 leading-tight">
                    {lang === "vn"
                      ? "Hệ thống tự động liên kết tài nguyên và mở quyền truy cập lập tức."
                      : "Click above to login as a mock member and test all interactive panels."}
                  </p>
                </div>
              </div>

              {/* Right Box: Enrollment Steps Info */}
              <div className="lg:col-span-3 glass rounded-3xl p-8 border border-white/10 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wide flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-accent" />
                    <span>
                      {lang === "vn"
                        ? "Gia nhập DTA trực tuyến"
                        : "Apply for DTA Membership"}
                    </span>
                  </h3>
                  <p className="text-xs text-muted-foreground mb-6">
                    {lang === "vn"
                      ? "Số hóa 100% quy trình nộp hồ sơ, thẩm tra tư cách pháp nhân trực tuyến theo đúng Điều lệ hoạt động trong tối đa 30 ngày."
                      : "Experience 100% digitized enrollment. The secretariat reviews legal status and technical fields online within 30 days."}
                  </p>

                  <div className="space-y-4">
                    {[
                      {
                        step: "01",
                        t:
                          lang === "vn"
                            ? "Nộp thông tin & hồ sơ năng lực"
                            : "Submit legal & technical profiles",
                        d:
                          lang === "vn"
                            ? "Khai báo tên tổ chức, MST, người đại diện và định hướng công nghệ số."
                            : "Provide organization name, tax ID, representative and target technology pillar.",
                      },
                      {
                        step: "02",
                        t:
                          lang === "vn"
                            ? "Số hóa thẩm tra trong 30 ngày"
                            : "Secretariat review (30-day window)",
                        d:
                          lang === "vn"
                            ? "Văn phòng DTA trực tuyến xác thực thông tin và trình Ban Chấp hành thông qua."
                            : "Secretariat validates legal documents and requests Executive Committee approval.",
                      },
                      {
                        step: "03",
                        t:
                          lang === "vn"
                            ? "Cấp thẻ Hội viên số & Tài khoản"
                            : "Digital Card & Member Credentials",
                        d:
                          lang === "vn"
                            ? "Nhận thẻ ID số hóa QR, tài khoản Cổng Thông tin và bắt đầu đóng hội phí công khai."
                            : "Receive QR-coded digital member card, credentials and begin monitoring transparent accounting.",
                      },
                    ].map((item) => (
                      <div key={item.step} className="flex gap-4 items-start">
                        <span className="text-xs font-black p-2 rounded-lg bg-accent/10 text-accent font-mono shrink-0">
                          {item.step}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-white">
                            {item.t}
                          </h4>
                          <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                            {item.d}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
                  <button
                    onClick={() => {
                      handleLogin(true);
                      setActiveTab("register");
                      setRegStep(1);
                    }}
                    className="px-6 py-3 rounded-full text-xs font-bold border border-accent/30 text-accent hover:bg-accent/10 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>
                      {lang === "vn"
                        ? "Mở Form Đăng ký Hội viên"
                        : "Open Online Registration Form"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* LOGGED IN MEMBER DASHBOARD */
            <div className="glass rounded-3xl border border-white/10 overflow-hidden">
              {/* Top Bar Dashboard */}
              <div className="p-6 bg-white/5 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent text-lg font-bold">
                    <User className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      <span>{profileData.companyName}</span>
                      <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-400 text-[8px] font-black uppercase tracking-wider rounded-md">
                        {lang === "vn"
                          ? "Hội viên Tổ chức"
                          : "Corporate Member"}
                      </span>
                    </h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {lang === "vn"
                        ? "Mã số: DTA-2026-0941 · Văn phòng số đang kết nối"
                        : "ID: DTA-2026-0941 · Digital Office Connected"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleLogin(false)}
                  className="px-3.5 py-1.5 rounded-lg text-[10px] font-bold border border-white/10 hover:bg-rose-500/10 hover:text-rose-400 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer text-muted-foreground"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{lang === "vn" ? "Đăng xuất" : "Sign Out"}</span>
                </button>
              </div>

              {/* Main Tabs layout */}
              <div className="grid md:grid-cols-5 min-h-[450px]">
                {/* Sidebar Tabs Selectors */}
                <div className="md:col-span-1 bg-white/[0.02] border-r border-white/5 p-4 flex flex-col gap-1">
                  {[
                    {
                      id: "profile",
                      icon: User,
                      label: lang === "vn" ? "Hồ sơ Hội viên" : "My Profile",
                    },
                    {
                      id: "finance",
                      icon: CreditCard,
                      label:
                        lang === "vn" ? "Hội phí & Tài chính" : "Fee & Ledger",
                    },
                    {
                      id: "resources",
                      icon: FileText,
                      label:
                        lang === "vn" ? "Ấn phẩm & Tài nguyên" : "Publications",
                    },
                    {
                      id: "forum",
                      icon: MessageSquare,
                      label:
                        lang === "vn" ? "Diễn đàn phản biện" : "Policy Forum",
                    },
                    {
                      id: "register",
                      icon: Plus,
                      label:
                        lang === "vn" ? "Đăng ký Hội viên mới" : "New Register",
                    },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                        activeTab === tab.id
                          ? "bg-white/10 text-white font-bold border-l-2 border-accent"
                          : "text-muted-foreground hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <tab.icon
                        className={`w-4 h-4 shrink-0 ${activeTab === tab.id ? "text-accent" : "text-muted-foreground"}`}
                      />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Main Tab Panel Content */}
                <div className="md:col-span-4 p-6 md:p-8">
                  {/* 1. PROFILE TAB */}
                  {activeTab === "profile" && (
                    <form onSubmit={handleUpdateProfile} className="space-y-5">
                      <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                        <User className="w-5 h-5 text-accent" />
                        <h4 className="text-base font-bold text-white">
                          {lang === "vn"
                            ? "Quản lý Hồ sơ Hội viên"
                            : "Member Profile Management"}
                        </h4>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] uppercase tracking-wider text-muted-foreground font-black mb-1.5">
                            {lang === "vn"
                              ? "Tên doanh nghiệp / Tổ chức"
                              : "Organization Name"}
                          </label>
                          <input
                            type="text"
                            value={profileData.companyName}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                companyName: e.target.value,
                              })
                            }
                            className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-accent/40"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase tracking-wider text-muted-foreground font-black mb-1.5">
                            {lang === "vn"
                              ? "Người đại diện trước Hiệp hội"
                              : "Legal Representative"}
                          </label>
                          <input
                            type="text"
                            value={profileData.representative}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                representative: e.target.value,
                              })
                            }
                            className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-accent/40"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[9px] uppercase tracking-wider text-muted-foreground font-black mb-1.5">
                            {lang === "vn"
                              ? "Năng lực & Trọng tâm Công nghệ"
                              : "Core Technical Focus"}
                          </label>
                          <input
                            type="text"
                            value={profileData.techStack}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                techStack: e.target.value,
                              })
                            }
                            className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-accent/40"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase tracking-wider text-muted-foreground font-black mb-1.5">
                            Website
                          </label>
                          <input
                            type="text"
                            value={profileData.website}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                website: e.target.value,
                              })
                            }
                            className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-accent/40"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase tracking-wider text-muted-foreground font-black mb-1.5">
                            {lang === "vn"
                              ? "Số lượng nhân sự số"
                              : "Tech Staff Count"}
                          </label>
                          <input
                            type="number"
                            value={profileData.staffCount}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                staffCount: e.target.value,
                              })
                            }
                            className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-accent/40"
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/5 flex justify-end">
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl font-bold text-xs text-primary-foreground hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                          style={{
                            background: "var(--gradient-primary)",
                            boxShadow: "var(--shadow-glow)",
                          }}
                        >
                          <Check className="w-4 h-4" />
                          <span>
                            {lang === "vn"
                              ? "Lưu thay đổi hồ sơ"
                              : "Save Changes"}
                          </span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* 2. FINANCE & MEMBERSHIP FEES */}
                  {activeTab === "finance" && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                        <CreditCard className="w-5 h-5 text-accent" />
                        <h4 className="text-base font-bold text-white">
                          {lang === "vn"
                            ? "Quản lý Hội phí & Báo cáo thu chi công khai"
                            : "Fee Ledger & Transparency Reports"}
                        </h4>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        {/* Left: Membership Fee Track */}
                        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5">
                          <h5 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4">
                            {lang === "vn"
                              ? "Tình trạng Hội phí Thường niên"
                              : "My Membership Fees"}
                          </h5>
                          <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5 mb-4">
                            <div>
                              <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">
                                {lang === "vn" ? "Niên khóa 2026" : "Year 2026"}
                              </span>
                              <span className="text-xl font-black text-white mt-1 block">
                                5.000.000 VNĐ
                              </span>
                            </div>
                            <div>
                              {showQR ? (
                                <span className="px-2.5 py-1 bg-emerald-500/15 text-emerald-400 text-[10px] font-black uppercase tracking-wider rounded-md flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>
                                    {lang === "vn" ? "Đã nộp" : "Paid"}
                                  </span>
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 bg-rose-500/15 text-rose-400 text-[10px] font-black uppercase tracking-wider rounded-md flex items-center gap-1">
                                  <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
                                  <span>
                                    {lang === "vn" ? "Chưa nộp" : "Unpaid"}
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>

                          {!showQR && (
                            <button
                              onClick={() => {
                                setShowQR(true);
                                toast.success(
                                  lang === "vn"
                                    ? "Hệ thống đã nhận thanh toán hội phí niên khóa 2026!"
                                    : "Annual membership fee payment recorded!",
                                );
                              }}
                              className="w-full py-3 rounded-xl font-bold text-xs text-primary-foreground hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              style={{
                                background: "var(--gradient-primary)",
                                boxShadow: "var(--shadow-glow)",
                              }}
                            >
                              <CreditCard className="w-4 h-4" />
                              <span>
                                {lang === "vn"
                                  ? "Thanh toán Hội phí trực tuyến (Simulate)"
                                  : "Simulate Annual Fee Payment"}
                              </span>
                            </button>
                          )}
                        </div>

                        {/* Right: Transparent accounting stats */}
                        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 flex flex-col justify-between">
                          <div>
                            <h5 className="text-xs font-extrabold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <TrendingUp className="w-4 h-4 text-emerald-400" />
                              <span>
                                {lang === "vn"
                                  ? "Báo cáo Thu chi Quỹ Hội tháng vừa qua"
                                  : "DTA Transparent Financial Reports"}
                              </span>
                            </h5>
                            <p className="text-[10px] text-muted-foreground leading-relaxed mb-4">
                              {lang === "vn"
                                ? "Minh bạch tài chính tuyệt đối. Mọi khoản thu chi được Văn phòng tự động cập nhật để Hội viên giám sát."
                                : "Total financial clarity. Every single transaction is automatically updated for democratic supervision."}
                            </p>

                            <div className="space-y-2 border-t border-white/5 pt-3 text-xs">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  {lang === "vn"
                                    ? "Tổng quỹ thu tích lũy:"
                                    : "Total accumulated revenue:"}
                                </span>
                                <span className="font-bold text-white">
                                  145.000.000 VNĐ
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  {lang === "vn"
                                    ? "Tổng chi hành động (XTTM, Đào tạo):"
                                    : "Total expenses (Trade, training):"}
                                </span>
                                <span className="font-bold text-rose-400">
                                  -112.000.000 VNĐ
                                </span>
                              </div>
                              <div className="flex justify-between pt-2 border-t border-white/5">
                                <span className="font-bold text-muted-foreground">
                                  {lang === "vn"
                                    ? "Dư nợ quỹ tồn hiện tại:"
                                    : "Current cash balance:"}
                                </span>
                                <span className="font-black text-emerald-400">
                                  33.000.000 VNĐ
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              toast.info(
                                lang === "vn"
                                  ? "Đang xuất sao kê tài chính chi tiết..."
                                  : "Exporting financial sheet...",
                              );
                              setTimeout(() => {
                                toast.success(
                                  lang === "vn"
                                    ? "Xuất sao kê PDF thành công!"
                                    : "PDF sheet exported successfully!",
                                );
                              }, 1200);
                            }}
                            className="w-full mt-4 py-2 border border-white/10 rounded-xl text-[10px] text-white uppercase font-bold hover:bg-white/5 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <FileDown className="w-3.5 h-3.5" />
                            <span>
                              {lang === "vn"
                                ? "Tải bảng sao kê thu chi chi tiết (PDF)"
                                : "Download Audit Sheet"}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. INTERNAL RESOURCES TAB */}
                  {activeTab === "resources" && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                        <FileText className="w-5 h-5 text-accent" />
                        <h4 className="text-base font-bold text-white">
                          {lang === "vn"
                            ? "Tài nguyên & Ấn phẩm lưu hành nội bộ"
                            : "DTA Library & Internal Publications"}
                        </h4>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {lang === "vn"
                          ? "Dành riêng cho Hội viên DTA. Các tài liệu phân tích thị trường, nghiên cứu thiết kế vi mạch bán dẫn và các nghị quyết đặc thù."
                          : "Exclusive resources for DTA members including tech whitepapers, microelectronics studies, and local business support decrees."}
                      </p>

                      <div className="grid sm:grid-cols-2 gap-4 pt-2">
                        {[
                          {
                            title:
                              lang === "vn"
                                ? "Ấn phẩm Toàn cảnh CNTT & Vi mạch Đà Nẵng 2026"
                                : "Danang Semiconductor & IT Landscape Report 2026",
                            size: "12.4 MB",
                            type: "PDF Report",
                          },
                          {
                            title:
                              lang === "vn"
                                ? "Nghị quyết số 02/2026/NQ-HĐND về cơ chế ưu đãi Vi mạch bán dẫn"
                                : "Decree No.02/2026/NQ-HDND on Semiconductor Incentives",
                            size: "2.1 MB",
                            type: "Government Bill",
                          },
                          {
                            title:
                              lang === "vn"
                                ? "Cẩm nang Đăng ký Sở hữu trí tuệ phần mềm quốc tế"
                                : "Manual for Software IP Registries & Patents in USA/EU",
                            size: "4.8 MB",
                            type: "Legal Manual",
                          },
                        ].map((file, i) => (
                          <div
                            key={i}
                            className="glass rounded-xl p-4 border border-white/5 flex flex-col justify-between hover:border-accent/20 transition-all duration-300"
                          >
                            <div>
                              <span className="text-[8px] font-black uppercase text-accent tracking-widest">
                                {file.type}
                              </span>
                              <h5 className="font-bold text-xs text-white leading-snug mt-1.5">
                                {file.title}
                              </h5>
                              <span className="text-[10px] text-muted-foreground font-mono mt-1 block">
                                {file.size}
                              </span>
                            </div>
                            <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
                              <button
                                onClick={() => {
                                  toast.loading(
                                    lang === "vn"
                                      ? "Đang tải tệp tin nội bộ..."
                                      : "Downloading file...",
                                  );
                                  setTimeout(() => {
                                    toast.dismiss();
                                    toast.success(
                                      lang === "vn"
                                        ? "Tải xuống hoàn tất!"
                                        : "Download complete!",
                                    );
                                  }, 1500);
                                }}
                                className="px-3 py-1.5 rounded-lg text-[10px] font-extrabold bg-accent/10 text-accent hover:bg-accent/20 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>
                                  {lang === "vn" ? "Tải xuống" : "Download"}
                                </span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 4. POLICY FEEDBACK FORUM */}
                  {activeTab === "forum" && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                        <MessageSquare className="w-5 h-5 text-accent" />
                        <h4 className="text-base font-bold text-white">
                          {lang === "vn"
                            ? "Diễn đàn phản biện & Đóng góp ý kiến chính trị số"
                            : "Digital Policy Feedback Forum"}
                        </h4>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {lang === "vn"
                          ? "Thực hiện nhiệm vụ 'Diễn đàn phản biện' của Hiệp hội. Hội viên đóng góp tiếng nói trực tiếp gửi lên các cơ quan nhà nước (Sở KH&CN, Sở Nội vụ, Sở TTTT)."
                          : "A democratic civic forum for technology firms. Post direct policy revisions, structural barriers, or funding proposals to municipal agencies."}
                      </p>

                      <form
                        onSubmit={handlePostFeedback}
                        className="space-y-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5"
                      >
                        <div>
                          <label className="block text-[9px] uppercase tracking-wider text-muted-foreground font-black mb-1.5">
                            {lang === "vn"
                              ? "Phân loại Kiến nghị"
                              : "Inquiry Category"}
                          </label>
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-accent/40 cursor-pointer"
                          >
                            <option value="policy" className="bg-slate-900">
                              {lang === "vn"
                                ? "Phản biện cơ chế / Chính sách chung"
                                : "Municipal Policy Revision"}
                            </option>
                            <option value="trade" className="bg-slate-900">
                              {lang === "vn"
                                ? "Xúc tiến thương mại / Liên minh doanh nghiệp"
                                : "B2B Trade & Partnership Suggestion"}
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase tracking-wider text-muted-foreground font-black mb-1.5">
                            {lang === "vn"
                              ? "Nội dung phản ánh / Đề xuất cơ chế đặc thù"
                              : "Proposal Details"}
                          </label>
                          <textarea
                            rows={3}
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder={
                              lang === "vn"
                                ? "Nhập chi tiết kiến nghị của doanh nghiệp bạn lên chính quyền TP..."
                                : "Provide clear descriptions of tax reliefs, rental subsidies, intellectual rights or semiconductor lab support needed..."
                            }
                            className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-accent/40"
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="px-5 py-2 rounded-xl font-bold text-xs text-primary-foreground hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                            style={{
                              background: "var(--gradient-primary)",
                              boxShadow: "var(--shadow-glow)",
                            }}
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>
                              {lang === "vn"
                                ? "Gửi Kiến nghị trực tuyến"
                                : "Submit Proposal"}
                            </span>
                          </button>
                        </div>
                      </form>

                      {/* Feedbacks list */}
                      <div className="space-y-4 pt-2">
                        <h5 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                          {lang === "vn"
                            ? "Kiến nghị đang được xử lý trên hệ thống"
                            : "Active Proposals and Revisions"}
                        </h5>

                        {feedbacks.map((f) => (
                          <div
                            key={f.id}
                            className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex justify-between items-start gap-2">
                                <span className="font-extrabold text-xs text-white">
                                  {f.author}
                                </span>
                                <span className="text-[9px] text-muted-foreground font-mono">
                                  {f.date}
                                </span>
                              </div>
                              <span className="px-2 py-0.5 bg-accent/10 text-accent text-[9px] font-bold rounded-md uppercase tracking-wider mt-1 inline-block">
                                {f.category}
                              </span>
                              <p className="text-xs text-muted-foreground mt-2.5 leading-relaxed">
                                {f.text}
                              </p>
                            </div>
                            <div className="mt-3.5 pt-2 border-t border-white/5 flex items-center gap-1.5 text-[10px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                              <span className="font-bold text-amber-400">
                                {f.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 5. ONLINE MEMBER REGISTRATION FORM */}
                  {activeTab === "register" && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                        <Plus className="w-5 h-5 text-accent" />
                        <h4 className="text-base font-bold text-white">
                          {lang === "vn"
                            ? "Đăng ký Hội viên Trực tuyến mới"
                            : "Online Membership Application Form"}
                        </h4>
                      </div>

                      {/* Step indicator */}
                      <div className="flex items-center gap-4 text-xs">
                        <span
                          className={`px-2 py-1 rounded-md font-bold ${regStep >= 1 ? "bg-accent text-primary-foreground font-extrabold" : "bg-white/5 text-muted-foreground"}`}
                        >
                          1
                        </span>
                        <span className="h-px bg-white/10 flex-1" />
                        <span
                          className={`px-2 py-1 rounded-md font-bold ${regStep >= 2 ? "bg-accent text-primary-foreground font-extrabold" : "bg-white/5 text-muted-foreground"}`}
                        >
                          2
                        </span>
                        <span className="h-px bg-white/10 flex-1" />
                        <span
                          className={`px-2 py-1 rounded-md font-bold ${regStep >= 3 ? "bg-accent text-primary-foreground font-extrabold" : "bg-white/5 text-muted-foreground"}`}
                        >
                          3
                        </span>
                      </div>

                      {regStep === 1 && (
                        <div className="space-y-4">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[9px] uppercase tracking-wider text-muted-foreground font-black mb-1.5">
                                {lang === "vn"
                                  ? "Tên Cơ quan / Tổ chức nộp đơn *"
                                  : "Organization Name *"}
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Công ty TNHH SoftTech Đà Nẵng"
                                value={regData.orgName}
                                onChange={(e) =>
                                  setRegData({
                                    ...regData,
                                    orgName: e.target.value,
                                  })
                                }
                                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-accent/40"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] uppercase tracking-wider text-muted-foreground font-black mb-1.5">
                                {lang === "vn"
                                  ? "Địa chỉ Email liên hệ chính *"
                                  : "Primary Email *"}
                              </label>
                              <input
                                type="email"
                                required
                                placeholder="e.g. contact@softtech.com"
                                value={regData.email}
                                onChange={(e) =>
                                  setRegData({
                                    ...regData,
                                    email: e.target.value,
                                  })
                                }
                                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-accent/40"
                              />
                            </div>
                          </div>

                          <div className="pt-4 flex justify-end">
                            <button
                              onClick={() => {
                                if (!regData.orgName || !regData.email) {
                                  toast.error(
                                    lang === "vn"
                                      ? "Vui lòng nhập đầy đủ các trường bắt buộc."
                                      : "Please fill in all required fields.",
                                  );
                                  return;
                                }
                                setRegStep(2);
                              }}
                              className="px-6 py-2.5 rounded-xl font-bold text-xs text-primary-foreground hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                              style={{
                                background: "var(--gradient-primary)",
                                boxShadow: "var(--shadow-glow)",
                              }}
                            >
                              <span>
                                {lang === "vn" ? "Tiếp tục" : "Next Step"}
                              </span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {regStep === 2 && (
                        <div className="space-y-5">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[9px] uppercase tracking-wider text-muted-foreground font-black mb-1.5">
                                {lang === "vn"
                                  ? "Lĩnh vực công nghệ cốt lõi"
                                  : "Technology Core Pillar"}
                              </label>
                              <select
                                value={regData.techField}
                                onChange={(e) =>
                                  setRegData({
                                    ...regData,
                                    techField: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-accent/40 cursor-pointer"
                              >
                                <option value="AI" className="bg-slate-900">
                                  {lang === "vn"
                                    ? "AI & Dữ liệu lớn"
                                    : "AI & Big Data"}
                                </option>
                                <option value="semi" className="bg-slate-900">
                                  {lang === "vn"
                                    ? "Vi mạch & Bán dẫn"
                                    : "Semiconductors & IC Design"}
                                </option>
                                <option value="cloud" className="bg-slate-900">
                                  {lang === "vn"
                                    ? "Điện toán đám mây"
                                    : "Cloud & Blockchain"}
                                </option>
                                <option value="iot" className="bg-slate-900">
                                  {lang === "vn"
                                    ? "Robot & Tự động hóa nhúng"
                                    : "Robotics & Automation"}
                                </option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[9px] uppercase tracking-wider text-muted-foreground font-black mb-1.5">
                                {lang === "vn"
                                  ? "Tải lên tài liệu chứng minh tư cách pháp lý (GPKD/Quyết định thành lập) *"
                                  : "Verify Legal Status (Business Certificate) *"}
                              </label>
                              <input
                                type="file"
                                onChange={() =>
                                  setRegData({ ...regData, hasLegalDoc: true })
                                }
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none cursor-pointer"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/15 text-amber-300 text-xs">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <p className="leading-relaxed">
                              {lang === "vn"
                                ? "Cam kết: Hồ sơ này nộp tự nguyện, hoàn toàn tuân thủ các nghĩa vụ đóng hội phí thường niên và thực thi đúng Dự thảo Điều lệ hoạt động của Hiệp hội."
                                : "Pledge: This enrollment is fully voluntary. We commit to the annual membership fee and adhere completely to DTA's public guidelines."}
                            </p>
                          </div>

                          <div className="pt-2 flex justify-between">
                            <button
                              onClick={() => setRegStep(1)}
                              className="px-5 py-2.5 rounded-xl font-bold text-xs border border-white/10 hover:bg-white/5 active:scale-95 transition-all text-white cursor-pointer"
                            >
                              {lang === "vn" ? "Quay lại" : "Back"}
                            </button>
                            <button
                              onClick={handleRegisterSubmit}
                              className="px-6 py-2.5 rounded-xl font-bold text-xs text-primary-foreground hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                              style={{
                                background: "var(--gradient-primary)",
                                boxShadow: "var(--shadow-glow)",
                              }}
                            >
                              <Check className="w-4 h-4" />
                              <span>
                                {lang === "vn"
                                  ? "Nộp hồ sơ trực tuyến"
                                  : "Submit Application"}
                              </span>
                            </button>
                          </div>
                        </div>
                      )}

                      {regStep === 3 && (
                        <div className="py-8 text-center space-y-4 max-w-lg mx-auto">
                          <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-4xl mx-auto">
                            <CheckCircle2 className="w-10 h-10" />
                          </div>
                          <h5 className="text-lg font-bold text-white uppercase tracking-wider">
                            {lang === "vn"
                              ? "Nộp hồ sơ gia nhập DTA thành công!"
                              : "Application Submitted Successfully!"}
                          </h5>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {lang === "vn"
                              ? "Cổng Thông tin Số hóa đã tiếp nhận đơn của bạn. Ban Thư ký sẽ tiến hành thẩm định tư cách pháp nhân trực tuyến và thông báo kết quả chính thức trong 30 ngày."
                              : "Our digital office registry has successfully received your application. The Secretariat will audit your legal files online and notify you within 30 business days."}
                          </p>

                          <div className="p-4 rounded-xl border border-white/5 bg-white/5 flex flex-col items-center">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                              {lang === "vn"
                                ? "Mã số biên nhận"
                                : "Application Tracking ID"}
                            </span>
                            <span className="text-base font-black text-accent mt-1 block font-mono">
                              {registeredCode}
                            </span>
                            <span className="text-[10px] text-amber-400 font-bold mt-2 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                              <span>
                                {lang === "vn"
                                  ? "Trạng thái: Đang thẩm tra trực tuyến"
                                  : "Status: Under Online Verification"}
                              </span>
                            </span>
                          </div>

                          <button
                            onClick={() => {
                              setRegStep(1);
                              setRegData({
                                orgName: "",
                                email: "",
                                representative: "",
                                techField: "AI",
                                hasLegalDoc: false,
                              });
                            }}
                            className="px-5 py-2.5 rounded-xl font-bold text-xs border border-white/10 hover:bg-white/5 active:scale-95 transition-all text-white cursor-pointer"
                          >
                            {lang === "vn"
                              ? "Nộp đơn mới"
                              : "Submit Another application"}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modern, Simple, Non-intrusive footer specifically for the portal page */}
      <footer className="border-t border-white/10 py-6 px-6 bg-black/40 text-center text-[10px] text-muted-foreground">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>
            © 2026 Danang Digital Technology Association (DTA). All rights
            reserved.
          </span>
          <div className="flex gap-4">
            <Link to="/" className="hover:text-white transition-colors">
              {lang === "vn" ? "Trang chủ" : "Home"}
            </Link>
            <span>·</span>
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
