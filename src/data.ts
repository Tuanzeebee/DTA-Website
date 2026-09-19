export interface NavItem {
  label: { vn: string; en: string };
  href: string;
}

export const navItems: NavItem[] = [
  { label: { vn: "Trang chủ", en: "Home" }, href: "#top" },
  { label: { vn: "Về DTA", en: "About Us" }, href: "#about" },
  { label: { vn: "Dịch vụ & Hỗ trợ", en: "Services" }, href: "#services" },
  { label: { vn: "Tin tức - Sự kiện", en: "News & Events" }, href: "/news" },
  { label: { vn: "Danh bạ Hội viên", en: "Members" }, href: "#members" },
  { label: { vn: "Thư viện ảnh", en: "Gallery" }, href: "#gallery" },
  {
    label: { vn: "Không gian số Hội viên", en: "Member Space" },
    href: "/portal",
  },
];

export interface TechArea {
  icon: string;
  title: { vn: string; en: string };
  desc: { vn: string; en: string };
}

export const coreTechAreas: TechArea[] = [
  {
    icon: "🧠",
    title: { vn: "AI & Dữ liệu lớn (Big Data)", en: "AI & Big Data" },
    desc: {
      vn: "Nghiên cứu, ứng dụng trí tuệ nhân tạo (AI) và dữ liệu lớn (Big Data) phục vụ chính quyền số và kinh tế số.",
      en: "R&D and applications of AI and big data for digital government and digital economy.",
    },
  },
  {
    icon: "☁️",
    title: { vn: "Điện toán đám mây & Blockchain", en: "Cloud & Blockchain" },
    desc: {
      vn: "Điện toán đám mây (Cloud), chuỗi khối (Blockchain) minh bạch cho giao dịch số và dịch vụ công.",
      en: "Cloud computing and transparent blockchain for digital transactions and public services.",
    },
  },
  {
    icon: "🔌",
    title: {
      vn: "Vi mạch – Bán dẫn, VR/AR & Thiết kế số",
      en: "Semiconductors, VR/AR & Digital Design",
    },
    desc: {
      vn: "Vi mạch – bán dẫn, thực tế ảo (VR)/tăng cường (AR), hệ thống nhúng–số, mỹ thuật công nghiệp, đồ họa, thiết kế thương hiệu.",
      en: "Semiconductors, VR/AR, embedded systems, industrial graphics and brand design.",
    },
  },
  {
    icon: "🤖",
    title: { vn: "Robot, Tự động hóa, IoT & in 3D", en: "Robotics, Automation, IoT & 3D" },
    desc: {
      vn: "Robot và tự động hóa, Internet vạn vật (IoT), in 3D, hệ thống số phục vụ sản xuất tiên tiến.",
      en: "Robotics and automation, IoT, 3D printing and digital systems for smart production.",
    },
  },
  {
    icon: "🛡️",
    title: {
      vn: "Viễn thông, Hạ tầng số & An toàn thông tin",
      en: "Telecom, Digital Infra & Cybersecurity",
    },
    desc: {
      vn: "Dịch vụ điện tử – viễn thông, hạ tầng số, an ninh mạng và an toàn thông tin, bảo vệ dữ liệu số.",
      en: "Electronics–telecom services, digital infrastructure and cybersecurity protecting digital assets.",
    },
  },
];

export interface ProgramService {
  tag: string;
  title: { vn: string; en: string };
  desc: { vn: string; en: string };
}

export const programsAndServices: ProgramService[] = [
  {
    tag: "Advocacy",
    title: {
      vn: "Tư vấn & Phản biện chính sách",
      en: "Policy Advocacy & Consulting",
    },
    desc: {
      vn: "Đóng góp ý kiến xây dựng hành lang pháp lý, cải thiện môi trường kinh doanh số và phản biện chính sách đặc thù của thành phố.",
      en: "Contributing feedback on legal frameworks, improving digital business climate, and offering expert policy reviews.",
    },
  },
  {
    tag: "Trade Promotion",
    title: {
      vn: "Xúc tiến thương mại & Thị trường",
      en: "Trade & Market Promotion",
    },
    desc: {
      vn: "Quảng bá thương hiệu, giới thiệu sản phẩm công nghệ của hội viên ra thị trường trong nước, quốc tế và kết nối đầu tư.",
      en: "Promoting member brands and tech solutions in domestic and global markets while facilitating strategic investment matchings.",
    },
  },
  {
    tag: "Training & Startups",
    title: {
      vn: "Đào tạo & Hỗ trợ Khởi nghiệp",
      en: "Training & Startup Support",
    },
    desc: {
      vn: "Bồi dưỡng chuyên môn công nghệ số, hỗ trợ các nhóm khởi nghiệp đổi mới sáng tạo gọi vốn và thương mại hóa sản phẩm.",
      en: "Nurturing digital skills, supporting innovative tech startups in early-stage fundraising and product commercialization.",
    },
  },
  {
    tag: "Legal Defense",
    title: {
      vn: "Bảo vệ quyền lợi & Pháp lý",
      en: "Rights Protection & Legal Support",
    },
    desc: {
      vn: "Hỗ trợ pháp lý về bản quyền sở hữu trí tuệ, giải quyết các tranh chấp công nghệ và chống các hành vi cạnh tranh không lành mạnh.",
      en: "Providing legal defense for software IP rights, settling tech disputes, and safeguarding members from unfair competition.",
    },
  },
];

export type MemberOwnership = "domestic" | "fdi";

export const MEMBER_OWNERSHIP_LABEL: Record<MemberOwnership, string> = {
  domestic: "Trong nước",
  fdi: "FDI",
};

export interface DtaMember {
  id: string;
  /** Tên tiếng Việt — hiển thị chính trong Danh bạ. */
  name: string;
  /** Tên tiếng Anh. */
  nameEn?: string;
  role: string;
  type: "organization" | "individual" | "advisory";
  /** Lĩnh vực hoạt động. */
  domain: string;
  /** Loại hình: trong nước hay FDI. */
  ownership?: MemberOwnership;
  /** Lãnh đạo / người đại diện. */
  leader?: string;
  /** Điện thoại liên hệ. */
  phone?: string;
  /** Thế mạnh / năng lực nổi bật. */
  strengths?: string;
  logoUrl?: string;
  website?: string;
}

/* Mock data cleared — ready for backend integration. */
export const membersData: DtaMember[] = [];

/* ------------------------------------------------------------------ *
 * allMembers() now fetches from the real backend API.
 * ------------------------------------------------------------------ */

let cachedMembers: DtaMember[] | null = null;
let cacheKey = "";

export function allMembers(): DtaMember[] {
  return cachedMembers ?? membersData;
}

/** Fetch members from the backend and update the cache. Called by components. */
export async function loadMembersFromApi(): Promise<DtaMember[]> {
  try {
    const res = await fetch("/api/news/members");
    if (!res.ok) return cachedMembers ?? membersData;
    const data = (await res.json()) as Array<{
      id: string;
      name: string;
      nameEn?: string | null;
      role: string;
      type: string;
      domain: string;
      ownership?: string | null;
      leader?: string | null;
      phone?: string | null;
      strengths?: string | null;
      logoUrl: string | null;
      website: string | null;
    }>;
    const members: DtaMember[] = data.map((m) => ({
      id: m.id,
      name: m.name,
      nameEn: m.nameEn ?? undefined,
      role: m.role,
      type: m.type as DtaMember["type"],
      domain: m.domain,
      ownership:
        m.ownership === "fdi" || m.ownership === "domestic"
          ? m.ownership
          : undefined,
      leader: m.leader ?? undefined,
      phone: m.phone ?? undefined,
      strengths: m.strengths ?? undefined,
      logoUrl: m.logoUrl ?? undefined,
      website: m.website ?? undefined,
    }));
    const key = JSON.stringify(members);
    if (key !== cacheKey) {
      cacheKey = key;
      cachedMembers = members;
    }
    return members;
  } catch {
    return cachedMembers ?? membersData;
  }
}

export interface DtaNews {
  title: { vn: string; en: string };
  date: string;
  category: { vn: string; en: string };
  summary: { vn: string; en: string };
  image: string;
}

/* Mock data cleared — ready for backend integration. */
export const dtaNews: DtaNews[] = [];

export interface DtaEvent {
  title: { vn: string; en: string };
  date: string;
  time: string;
  location: { vn: string; en: string };
  status: { vn: string; en: string };
  image: string;
}

/* Mock data cleared — ready for backend integration. */
export const dtaEvents: DtaEvent[] = [];

export interface FaqItem {
  q: { vn: string; en: string };
  a: { vn: string; en: string };
}

/* Mock data cleared — ready for backend integration. */
export const faqs: FaqItem[] = [];

export const translationStrings = {
  headerSlogan: {
    vn: "Hiệp hội Công nghệ số thành phố Đà Nẵng",
    en: "Danang Digital Technology Association",
  },
  ctaJoin: {
    vn: "Gia nhập DTA",
    en: "Join DTA",
  },
  ctaPortal: {
    vn: "Cổng Hội viên",
    en: "Member Portal",
  },
  heroEyebrow: {
    vn: "HIỆP HỘI CÔNG NGHỆ SỐ THÀNH PHỐ ĐÀ NẴNG · DTA",
    en: "DANANG DIGITAL TECHNOLOGY ASSOCIATION · DTA",
  },
  heroTitle: {
    vn: "HỢP TÁC · LIÊN KẾT PHÁT TRÌỂN BỀN VỮNG",
    en: "COLLABORATION · CONNECTION SUSTAINABLE DEVELOPMENT",
  },
  heroSub: {
    vn: "Cầu nối liên kết và nền tảng hỗ trợ đắc lực cho các doanh nghiệp, tổ chức học thuật, chuyên gia và smart city builders tại miền Trung.",
    en: "A vital bridge and digital platform supporting tech enterprises, academic institutes, and smart city builders in Central Vietnam.",
  },
  heroBtn1: {
    vn: "Gia nhập DTA",
    en: "Join DTA",
  },
  heroBtn2: {
    vn: "Xem danh bạ Hội viên",
    en: "View Directory",
  },
  charterTitle: {
    vn: "Tôn chỉ & Mục đích hoạt động của DTA",
    en: "DTA Core Tenets & Objectives",
  },
  charterDesc1: {
    vn: "Tập hợp, kết nối, bảo vệ quyền và lợi ích hợp pháp của hội viên; hỗ trợ nâng cao hình ảnh, thương hiệu, học hiệu, ứng dụng giải pháp số và năng lực cạnh tranh.",
    en: "Uniting and connecting members while safeguarding their lawful rights and interests; helping elevate their image, brands, institutional reputation and competitiveness.",
  },
  charterDesc2: {
    vn: "Tham gia góp ý, phản biện chính sách; thúc đẩy chuyển đổi số, đô thị thông minh, hệ sinh thái đổi mới sáng tạo và khởi nghiệp.",
    en: "Contributing policy feedback and critique; advancing digital transformation, smart cities, innovation ecosystems and startups.",
  },
  charterDesc3: {
    vn: "Quảng bá cộng đồng công nghệ số Đà Nẵng, lan tỏa động lực Miền Trung – Tây Nguyên; mở rộng hợp tác trong nước và quốc tế.",
    en: "Promoting Danang's digital technology community across the Central – Highlands region; expanding domestic and international cooperation.",
  },
  btnCharterDetail: {
    vn: "Xem toàn văn Điều lệ Hiệp hội (Chính thức)",
    en: "View Association Charter (Official)",
  },
};
