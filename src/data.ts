export interface NavItem {
  label: { vn: string; en: string };
  href: string;
}

export const navItems: NavItem[] = [
  { label: { vn: "Trang chủ", en: "Home" }, href: "#top" },
  { label: { vn: "Về DTA", en: "About Us" }, href: "#about" },
  { label: { vn: "Lĩnh vực công nghệ", en: "Core Tech" }, href: "#topics" },
  { label: { vn: "Dịch vụ & Hỗ trợ", en: "Services" }, href: "#services" },
  { label: { vn: "Tin tức - Sự kiện", en: "News & Events" }, href: "/news" },
  { label: { vn: "Danh bạ Hội viên", en: "Members" }, href: "#members" },
  {
    label: { vn: "Cổng Hội viên & Diễn đàn", en: "Digital Portal" },
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
      vn: "Thúc đẩy nghiên cứu, ứng dụng trí tuệ nhân tạo và phân tích dữ liệu lớn phục vụ chính quyền số và kinh tế số Đà Nẵng.",
      en: "Promoting R&D and applications of AI and big data analytics for digital government and digital economy in Danang.",
    },
  },
  {
    icon: "☁️",
    title: { vn: "Điện toán đám mây & Blockchain", en: "Cloud & Blockchain" },
    desc: {
      vn: "Xây dựng hạ tầng Cloud bền vững và phát triển ứng dụng chuỗi khối minh bạch cho giao dịch số và dịch vụ công.",
      en: "Building sustainable Cloud infrastructure and developing transparent blockchain solutions for digital transactions.",
    },
  },
  {
    icon: "🔌",
    title: {
      vn: "Vi mạch – Bán dẫn & Thiết kế số",
      en: "Semiconductors & IC Design",
    },
    desc: {
      vn: "Trọng tâm chiến lược của Đà Nẵng, đào tạo nguồn nhân lực chất lượng cao và thu hút đầu tư thiết kế mạch tích hợp IC.",
      en: "Strategic focus of Danang, nurturing high-quality engineering talents and attracting global IC design investments.",
    },
  },
  {
    icon: "🤖",
    title: { vn: "Robot, Tự động hóa & IoT", en: "Robotics, Automation & IoT" },
    desc: {
      vn: "Phát triển các hệ thống nhúng thông minh, giải pháp IoT công nghiệp và tự động hóa dây chuyền sản xuất tiên tiến.",
      en: "Developing smart embedded systems, industrial IoT solutions, and state-of-the-art production line automation.",
    },
  },
  {
    icon: "🛡️",
    title: {
      vn: "An toàn thông tin & Hạ tầng số",
      en: "Cybersecurity & Digital Infrastructure",
    },
    desc: {
      vn: "Đảm bảo an ninh an toàn thông tin mạng, bảo vệ dữ liệu số của doanh nghiệp và vận hành hạ tầng số vững chắc.",
      en: "Ensuring network security, protecting enterprise digital assets, and operating robust, secure digital backbones.",
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

export interface DtaMember {
  id: string;
  name: string;
  role: string;
  type: "organization" | "individual" | "advisory";
  domain: string;
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
      role: string;
      type: string;
      domain: string;
      logoUrl: string | null;
      website: string | null;
    }>;
    const members: DtaMember[] = data.map((m) => ({
      id: m.id,
      name: m.name,
      role: m.role,
      type: m.type as DtaMember["type"],
      domain: m.domain,
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
    vn: "Cầu nối liên kết, diễn đàn phản biện và nền tảng hỗ trợ đắc lực cho các doanh nghiệp, tổ chức học thuật, chuyên gia và smart city builders tại miền Trung.",
    en: "A vital bridge, policy forum, and digital platform supporting tech enterprises, academic institutes, and smart city builders in Central Vietnam.",
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
    vn: "Hiệp hội Công nghệ số thành phố Đà Nẵng (DTA) là tổ chức xã hội - nghề nghiệp tự nguyện, tập hợp các doanh nghiệp, viện nghiên cứu, trường đại học và cá nhân tâm huyết hoạt động trong lĩnh vực nghiên cứu, ứng dụng, chuyển giao và kinh doanh sản phẩm, dịch vụ công nghệ số.",
    en: "The Danang Digital Technology Association (DTA) is a voluntary social-professional organization gathering tech corporations, academic institutes, and dedicated experts active in research, transfer, and business of digital products and services.",
  },
  charterDesc2: {
    vn: "DTA đóng vai trò định hướng chuyển đổi số toàn diện, ươm mầm khởi nghiệp đổi mới sáng tạo, phát triển nguồn nhân lực vi mạch bán dẫn mũi nhọn, đồng thời chung tay xây dựng Đà Nẵng trở thành đô thị thông minh kiểu mẫu, có sức lan tỏa kinh tế số mạnh mẽ toàn khu vực miền Trung - Tây Nguyên.",
    en: "DTA guides full-scale digital transformation, incubates innovative startups, develops high-end semiconductor talents, and collaborates to build Danang into a smart city hub driving the digital economy across the Central & Highlands region.",
  },
  btnCharterDetail: {
    vn: "Xem toàn văn Điều lệ Hiệp hội (Dự thảo)",
    en: "View Association Charter (Full Draft)",
  },
};
