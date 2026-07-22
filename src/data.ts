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
  name: { vn: string; en: string };
  role: { vn: string; en: string };
  type: "organization" | "individual" | "advisory";
  domain: { vn: string; en: string };
  logoInitials: string;
  logoUrl?: string;
  /** Member site URL — logos on the news portal must link out (per brief). */
  website?: string;
}

export const membersData: DtaMember[] = [
  {
    id: "m1",
    name: {
      vn: "Công ty Cổ phần FPT (Chi nhánh Đà Nẵng)",
      en: "FPT Corporation (Danang Branch)",
    },
    role: {
      vn: "Hội viên Tổ chức · Doanh nghiệp nòng cốt",
      en: "Corporate Member · Core Tech Enterprise",
    },
    type: "organization",
    domain: {
      vn: "Phát triển phần mềm, Xuất khẩu CNTT & Đào tạo vi mạch bán dẫn",
      en: "Software R&D, IT Outsourcing & Semiconductor Training",
    },
    logoInitials: "FPT",
  },
  {
    id: "m2",
    name: {
      vn: "Trường Đại học Bách khoa – Đại học Đà Nẵng",
      en: "University of Science and Technology - UD",
    },
    role: {
      vn: "Hội viên Tổ chức · Viện trường nghiên cứu",
      en: "Corporate Member · University & Research Institute",
    },
    type: "organization",
    domain: {
      vn: "Đào tạo kỹ sư CNTT chất lượng cao, Điện tử Viễn thông & Hệ thống nhúng",
      en: "Nurturing High-quality IT, Telecommunication & Embedded Engineers",
    },
    logoInitials: "DUT",
  },
  {
    id: "m3",
    name: {
      vn: "Công ty TNHH Acronics Đà Nẵng",
      en: "Acronics Solutions Danang",
    },
    role: {
      vn: "Hội viên Tổ chức · Doanh nghiệp thiết kế",
      en: "Corporate Member · IC Design Enterprise",
    },
    type: "organization",
    domain: {
      vn: "Thiết kế vi mạch, đo kiểm bán dẫn & phát triển thiết bị IoT thông minh",
      en: "Integrated Circuit (IC) Design, Semiconductor Testing & Smart IoT",
    },
    logoInitials: "ACR",
  },
  {
    id: "m4",
    name: { vn: "Công ty Cổ phần Enouvo", en: "Enouvo Group" },
    role: {
      vn: "Hội viên Tổ chức · Giải pháp Chuyển đổi số",
      en: "Corporate Member · Digital Solutions",
    },
    type: "organization",
    domain: {
      vn: "Phát triển ứng dụng Web/Mobile, Không gian làm việc số & Branding",
      en: "Web & Mobile Development, Digital Workspaces & Tech Branding",
    },
    logoInitials: "ENV",
  },
  {
    id: "m5",
    name: {
      vn: "PGS. TS. Nguyễn Thanh Bình",
      en: "Assoc. Prof. Dr. Nguyen Thanh Binh",
    },
    role: {
      vn: "Hội viên Cá nhân · Nhà khoa học",
      en: "Individual Member · Scientist",
    },
    type: "individual",
    domain: {
      vn: "Nghiên cứu Trí tuệ nhân tạo (AI), Kỹ nghệ tri thức & Công nghệ phần mềm",
      en: "AI Research, Knowledge Engineering & Software Engineering",
    },
    logoInitials: "NTB",
  },
  {
    id: "m6",
    name: { vn: "TS. Lê Nguyên Bảo", en: "Dr. Le Nguyen Bao" },
    role: {
      vn: "Hội viên Cá nhân · Chuyên gia Giáo dục",
      en: "Individual Member · Academic Specialist",
    },
    type: "individual",
    domain: {
      vn: "Định hướng đổi mới sáng tạo, quản lý đào tạo nhân lực bán dẫn & CNTT",
      en: "Innovation Strategy, IT & Semiconductor Education Management",
    },
    logoInitials: "LNB",
  },
  {
    id: "m7",
    name: { vn: "Ông Huỳnh Huy Hòa", en: "Mr. Huynh Huy Hoa" },
    role: {
      vn: "Hội viên Danh dự · Ban Cố vấn",
      en: "Honorary Member · Advisory Board",
    },
    type: "advisory",
    domain: {
      vn: "Viện trưởng Viện Nghiên cứu phát triển kinh tế - xã hội Đà Nẵng",
      en: "Director of Danang Institute for Socio-Economic Development (DISED)",
    },
    logoInitials: "HHH",
  },
  {
    id: "m8",
    name: { vn: "BAP IT Co., Ltd", en: "BAP IT Co., Ltd" },
    role: {
      vn: "Hội viên Tổ chức · Giải pháp Công nghệ",
      en: "Corporate Member · Tech Solutions",
    },
    type: "organization",
    domain: {
      vn: "Ứng dụng AI, Blockchain, Web3, Salesforce & Hệ thống ERP doanh nghiệp",
      en: "AI Integration, Blockchain, Web3, Salesforce & Enterprise ERP",
    },
    logoInitials: "BAP",
  },
  {
    id: "m9",
    name: { vn: "Bà Trịnh Thị Kim Chi", en: "Ms. Trinh Thi Kim Chi" },
    role: {
      vn: "Hội viên Cá nhân · Tư vấn sở hữu trí tuệ",
      en: "Individual Member · IP consultant",
    },
    type: "individual",
    domain: {
      vn: "Bảo hộ bản quyền phần mềm, tư vấn pháp lý chuyển đổi số doanh nghiệp",
      en: "Software Copyright Protection, Corporate Digital Law & Compliance",
    },
    logoInitials: "TKC",
  },
  {
    id: "m10",
    name: {
      vn: "Trường Đại học Duy Tân",
      en: "Duy Tan University (DTU)",
    },
    role: {
      vn: "Hội viên Tổ chức · Viện trường nghiên cứu",
      en: "Corporate Member · University & Research Institute",
    },
    type: "organization",
    domain: {
      vn: "Đào tạo cử nhân, kỹ sư CNTT, Trí tuệ nhân tạo, Khoa học dữ liệu & Vi mạch",
      en: "Education in IT, Artificial Intelligence, Data Science & Semiconductors",
    },
    logoInitials: "DTU",
    logoUrl:
      "https://dsa.org.vn/wp-content/uploads/2017/11/duy-tan-480x300.png",
  },
  {
    id: "m11",
    name: {
      vn: "Tổng Công ty Giải pháp Doanh nghiệp Viettel (Đà Nẵng)",
      en: "Viettel Business Solutions (Danang Branch)",
    },
    role: {
      vn: "Hội viên Tổ chức · Doanh nghiệp viễn thông",
      en: "Corporate Member · Telecom & Cloud Enterprise",
    },
    type: "organization",
    domain: {
      vn: "Hạ tầng Trung tâm dữ liệu (Data Center), Điện toán đám mây & Smart City",
      en: "Data Center Infrastructure, Cloud Computing & Smart City Solutions",
    },
    logoInitials: "VTL",
  },
  {
    id: "m12",
    name: {
      vn: "Trường Đại học Duy Tân (Phân hiệu CNTT)",
      en: "Duy Tan University (School of Computer Science)",
    },
    role: {
      vn: "Hội viên Tổ chức · Viện trường nghiên cứu",
      en: "Corporate Member · University & Research Institute",
    },
    type: "organization",
    domain: {
      vn: "Nghiên cứu ứng dụng Công nghệ phần mềm & Trí tuệ nhân tạo",
      en: "R&D in Software Engineering & Applied Artificial Intelligence",
    },
    logoInitials: "DTU",
    logoUrl:
      "https://dsa.org.vn/wp-content/uploads/2017/11/duy-tan-480x300.png",
  },
];

export interface DtaNews {
  title: { vn: string; en: string };
  date: string;
  category: { vn: string; en: string };
  summary: { vn: string; en: string };
  image: string;
}

export const dtaNews: DtaNews[] = [
  {
    title: {
      vn: "Đà Nẵng ban hành Đề án phát triển vi mạch bán dẫn giai đoạn đến 2030",
      en: "Danang issues Master Plan for Semiconductor Industry Development to 2030",
    },
    date: "12/07/2026",
    category: { vn: "Chính sách số", en: "Digital Policy" },
    summary: {
      vn: "Nghị quyết của HĐND thành phố thông qua nhiều cơ chế đặc thù, hỗ trợ 100% học phí đào tạo nhân lực vi mạch và ưu đãi thuế thu nhập doanh nghiệp.",
      en: "City council resolution approves special mechanisms, offering 100% tuition subsidy for semiconductor training and corporate income tax exemptions.",
    },
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: {
      vn: "Ra mắt Ấn phẩm Công nghệ số Đà Nẵng 2026: Toàn cảnh thị trường nhân lực AI",
      en: "Launch of Danang Digital Tech Report 2026: Visualizing the AI Talents Market",
    },
    date: "01/07/2026",
    category: { vn: "Ấn phẩm nội bộ", en: "Internal Publication" },
    summary: {
      vn: "Tài liệu lưu hành nội bộ của DTA phân tích chi tiết cơ cấu nguồn nhân lực, xu hướng công nghệ tuyển dụng trọng tâm và phổ lương kỹ sư AI.",
      en: "DTA's internal whitepaper detailing human resources structure, key recruitment trends, and average payroll benchmarks for local AI engineers.",
    },
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: {
      vn: "Thủ tướng phê duyệt Kế hoạch ưu tiên sử dụng sản phẩm số Việt Nam",
      en: "PM Approves Action Plan to Prioritize Vietnamese Software & IT Products",
    },
    date: "20/06/2026",
    category: { vn: "Chính sách vĩ mô", en: "Macro Policy" },
    summary: {
      vn: "Tạo điều kiện tối đa cho các cơ quan nhà nước sử dụng phần mềm Make-in-Vietnam của các hội viên hiệp hội số địa phương.",
      en: "Creating favorable conditions for public agencies to implement Make-in-Vietnam software built by local digital association members.",
    },
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: {
      vn: "DTA tổ chức đoàn xúc tiến thương mại số tại thị trường Nhật Bản và Hàn Quốc",
      en: "DTA organizes digital trade promotion mission to Japan and South Korea",
    },
    date: "15/05/2026",
    category: { vn: "Hoạt động Hội viên", en: "Member Activities" },
    summary: {
      vn: "Chương trình kết nối giao thương giữa 15 doanh nghiệp công nghệ số Đà Nẵng với các đối tác IT hàng đầu Tokyo, Kyoto và Seoul nhằm đẩy mạnh xuất khẩu phần mềm.",
      en: "B2B matchmaking program linking 15 Danang digital companies with top IT partners in Tokyo, Kyoto, and Seoul to accelerate software exports.",
    },
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: {
      vn: "Ứng dụng trí tuệ nhân tạo tạo sinh (GenAI) trong dịch vụ hành chính công Đà Nẵng",
      en: "Applying Generative AI (GenAI) in Danang's Public Administrative Services",
    },
    date: "28/04/2026",
    category: { vn: "Công nghệ mới", en: "Emerging Tech" },
    summary: {
      vn: "Thành phố Đà Nẵng thử nghiệm trợ lý ảo AI thông minh hỗ trợ người dân thực hiện thủ tục đất đai, kinh doanh trực tuyến 24/7 với độ chính xác cao.",
      en: "Danang City pilots an intelligent AI virtual assistant to support citizens in processing online land and business procedures 24/7 with high accuracy.",
    },
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: {
      vn: "Đại hội đại biểu Hiệp hội Công nghệ số thành phố Đà Nẵng nhiệm kỳ mới",
      en: "General Assembly of Danang Digital Technology Association for New Term",
    },
    date: "10/04/2026",
    category: { vn: "Hoạt động Hội viên", en: "Member Activities" },
    summary: {
      vn: "Bầu ra Ban Chấp hành mới gồm 21 đại diện từ các tập đoàn công nghệ lớn, trường đại học đào tạo CNTT hàng đầu và các quỹ đầu tư mạo hiểm khu vực miền Trung.",
      en: "Electing a new Executive Board of 21 leaders from major tech corporations, top IT universities, and regional venture capital firms.",
    },
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800",
  },
];

export interface DtaEvent {
  title: { vn: string; en: string };
  date: string;
  time: string;
  location: { vn: string; en: string };
  status: { vn: string; en: string };
  image: string;
}

export const dtaEvents: DtaEvent[] = [
  {
    title: {
      vn: "Hội thảo quốc tế 'Đà Nẵng - Điểm đến thiết kế vi mạch & AI toàn cầu'",
      en: "International Seminar 'Danang - Global Hub for IC Design & AI'",
    },
    date: "18/08/2026",
    time: "08:00 - 17:00",
    location: {
      vn: "Khách sạn Novotel Danang Premier sông Hàn & Trực tuyến",
      en: "Novotel Danang Premier Han River & Online",
    },
    status: { vn: "Đang mở đăng ký trực tuyến", en: "Registration Open" },
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: {
      vn: "Diễn đàn phản biện chính sách: Cơ chế ưu đãi thuế cho hạ tầng dữ liệu lớn",
      en: "Policy Feedback Forum: Special Tax Incentives for Big Data Infrastructure",
    },
    date: "25/08/2026",
    time: "14:00 - 17:00",
    location: {
      vn: "Văn phòng DTA, Tòa nhà 15 Quang Trung, Đà Nẵng",
      en: "DTA Office, 15 Quang Trung Bldg, Danang",
    },
    status: {
      vn: "Hội viên DTA đăng ký miễn phí",
      en: "Exclusive for Members",
    },
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: {
      vn: "Khóa tập huấn chuyên sâu: Lập trình hệ thống nhúng & Robot thông minh",
      en: "Advanced Training Course: Embedded Systems & Smart Robotics Programming",
    },
    date: "05/09/2026",
    time: "Mỗi tối thứ 7 trong tháng 9",
    location: {
      vn: "Phòng Lab thông minh, Trường ĐH Bách Khoa Đà Nẵng",
      en: "Smart Lab, University of Science and Technology",
    },
    status: {
      vn: "Yêu cầu thẻ Hội viên số",
      en: "Requires Digital Member Card",
    },
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
  },
];

export interface FaqItem {
  q: { vn: string; en: string };
  a: { vn: string; en: string };
}

export const faqs: FaqItem[] = [
  {
    q: {
      vn: "Điều kiện để gia nhập Hiệp hội Công nghệ số thành phố Đà Nẵng (DTA) là gì?",
      en: "What are the requirements to join the Danang Digital Technology Association (DTA)?",
    },
    a: {
      vn: "Tất cả các tổ chức (doanh nghiệp, trường đại học, viện nghiên cứu) và cá nhân chuyên gia hoạt động hợp pháp trong lĩnh vực công nghệ số, viễn thông, chuyển đổi số tại Đà Nẵng và miền Trung - Tây Nguyên đều có quyền nộp đơn gia nhập tự nguyện.",
      en: "All organizations (enterprises, universities, research institutes) and individual experts legally active in digital technology, telecommunications, and digital transformation in Danang and the Central-Highlands are welcome to voluntarily apply.",
    },
  },
  {
    q: {
      vn: "Quy trình nộp hồ sơ gia nhập trực tuyến diễn ra trong bao lâu?",
      en: "How long does the online membership registration process take?",
    },
    a: {
      vn: "Theo Điều lệ hoạt động của DTA, sau khi bạn nộp hồ sơ trực tuyến qua Văn phòng số, Ban Thư ký sẽ tiến hành thẩm tra, số hóa và trình Ban Chấp hành phê duyệt trong vòng tối đa 30 ngày làm việc.",
      en: "According to DTA's Charter, after you submit your application online through our Digital Office, the Secretariat will verify, process, and present it to the Executive Board for approval within a maximum of 30 business days.",
    },
  },
  {
    q: {
      vn: "Hội viên nhận được các đặc quyền và hỗ trợ nào từ DTA?",
      en: "What privileges and support do members receive from DTA?",
    },
    a: {
      vn: "Hội viên được quảng bá thương hiệu miễn phí trên danh bạ, tham gia các hoạt động xúc tiến thương mại kết nối dự án, tiếp cận nguồn ấn phẩm/tài liệu nghiên cứu công nghệ lưu hành nội bộ, được Hiệp hội hỗ trợ pháp lý bảo hộ bản quyền phần mềm và phản biện chính sách đến chính quyền.",
      en: "Members benefit from free directory branding, access to B2B matchings and trade programs, access to internal technical journals, legal defense support for software copyright protection, and direct channels to convey policy feedback to the local government.",
    },
  },
  {
    q: {
      vn: "Quy chế quản lý tài chính và hội phí thường niên được công khai như thế nào?",
      en: "How is the financial management and annual membership fee system made transparent?",
    },
    a: {
      vn: "DTA là tổ chức phi lợi nhuận dân chủ và minh bạch. Mọi báo cáo thu chi, quỹ hội, các nguồn đóng góp tài trợ đều được đăng tải công khai thường kỳ hàng tháng trên Cổng Hội viên số để toàn bộ thành viên trực tiếp giám sát.",
      en: "DTA is a non-profit, democratic, and transparent association. All financial income and expense statements, funds, and sponsorships are published monthly on the Member Portal for direct supervision by all members.",
    },
  },
];

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
