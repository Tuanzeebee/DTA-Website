/**
 * Data model for the DTA news portal (/news).
 *
 * Legal frame: the site operates as "Trang thông tin điện tử tổng hợp"
 * (licence 447/GP-STTTT), NOT an online newspaper — content limits follow
 * from that licence and are restated in the portal footer.
 *
 * Structure per the association's brief: 4 fixed MAIN TOPICS shown in the
 * menu, each with sub-categories. Articles carry free-form `tags` so editors
 * can label content flexibly, but navigation only ever exposes main topics.
 *
 * ALL ARTICLES BELOW ARE MOCK CONTENT (<!-- mock -->) — placeholders until
 * the editorial team supplies real posts and real PDF files.
 */

export interface NewsCategory {
  slug: string;
  name: string;
  desc: string;
}

export interface MainTopic {
  slug: string;
  name: string;
  /** Short label used where the full name is too long (menu, breadcrumbs). */
  short: string;
  categories: NewsCategory[];
}

export const mainTopics: MainTopic[] = [
  {
    slug: "su-kien",
    name: "Sự kiện",
    short: "Sự kiện",
    categories: [
      {
        slug: "tai-nguyen-chinh-sach",
        name: "Tài nguyên – Chính sách mới",
        desc: "Kho chính sách, quy định, hướng dẫn; cập nhật văn bản Trung ương và thành phố. Tải văn bản (PDF) về máy.",
      },
      {
        slug: "tin-trong-nganh",
        name: "Tin trong ngành",
        desc: 'Diễn đàn "Từ suy nghĩ đến bàn phím" — hội viên chia sẻ giải pháp, thành tựu; dẫn link về website hội viên.',
      },
    ],
  },
  {
    slug: "digi-tech",
    name: "Nguồn nhân lực Digi-Tech",
    short: "Digi-Tech",
    categories: [
      {
        slug: "dao-tao",
        name: "Đào tạo nguồn nhân lực",
        desc: "Chương trình đào tạo, bồi dưỡng kỹ năng số cho nhân lực công nghệ Đà Nẵng.",
      },
      {
        slug: "tuyen-dung",
        name: "Tuyển dụng",
        desc: "Tổng hợp nhu cầu tuyển dụng của hội viên và tìm việc — ưu tiên tin Thực tập sinh.",
      },
    ],
  },
  {
    slug: "mai-nha-chung",
    name: "Mái nhà chung DTA",
    short: "Mái nhà chung",
    categories: [
      {
        slug: "tu-dsa-den-dta",
        name: "Từ DSA đến DTA",
        desc: "Lịch sử, sứ mệnh; Ban Chấp hành – Ban Kiểm tra các nhiệm kỳ.",
      },
      {
        slug: "cong-dong",
        name: "DTA – Cộng đồng chúng ta",
        desc: "Mỗi hội viên một logo (nhúng link) và bài tự giới thiệu; hội viên tự cập nhật, tòa soạn duyệt xuất bản.",
      },
      {
        slug: "gia-nhap",
        name: "Gia nhập DTA",
        desc: "Portal gia nhập: hướng dẫn thủ tục, nộp hồ sơ trực tuyến, biểu mẫu và quy định hội phí.",
      },
      {
        slug: "noi-vong-tay-lon",
        name: "Nối vòng tay lớn",
        desc: "Kết nối hợp tác: mời thầu, mời cung ứng, tìm đối tác — gửi nhu cầu trực tiếp trên trang.",
      },
      {
        slug: "xa-hoi",
        name: "Xã hội",
        desc: "Tin hoạt động thiện nguyện của cộng đồng DTA.",
      },
    ],
  },
  {
    slug: "da-nang-24h",
    name: "Đà Nẵng 24h – Góc nhìn DSA",
    short: "Đà Nẵng 24h",
    categories: [
      {
        slug: "tin-tuc",
        name: "Tin tức",
        desc: "Tin công nghệ số Đà Nẵng qua góc nhìn của hiệp hội.",
      },
      {
        slug: "su-kien-sap-den",
        name: "Sự kiện sắp đến",
        desc: "Lịch tổng hợp sự kiện công nghệ số tại Đà Nẵng: DevDay, Ngày hội việc làm, Techfest…",
      },
    ],
  },
];

export interface PortalArticle {
  id: string;
  title: string;
  summary: string;
  topic: string; // MainTopic.slug
  category: string; // NewsCategory.slug
  date: string; // dd/mm/yyyy
  image: string;
  /** Editor-applied soft labels — flexible, never part of the menu. */
  tags: string[];
  views: number;
  /** Policy documents must be downloadable. */
  pdfUrl?: string;
  /** Industry news may link out to the member's own site. */
  memberUrl?: string;
  /** Recruitment: intern posts get priority placement. */
  isIntern?: boolean;
  body: string[];
}

/* <!-- mock --> All articles are sample data awaiting real editorial content. */
export const portalArticles: PortalArticle[] = [
  {
    id: "cs-01",
    title:
      "Nghị định mới về giao dịch điện tử: những điểm doanh nghiệp số cần lưu ý",
    summary:
      "Tổng hợp các thay đổi chính về chữ ký số, định danh điện tử và lưu trữ chứng từ có hiệu lực từ quý III.",
    topic: "su-kien",
    category: "tai-nguyen-chinh-sach",
    date: "18/07/2026",
    image: "https://picsum.photos/seed/dta-policy-1/800/450",
    tags: ["Chính sách", "Giao dịch điện tử"],
    views: 1240,
    pdfUrl: "/documents/nghi-dinh-giao-dich-dien-tu.pdf",
    body: [
      "Văn bản quy định chi tiết về giá trị pháp lý của chữ ký điện tử chuyên dùng và điều kiện bảo đảm an toàn.",
      "Hội viên có thể tải toàn văn văn bản (PDF) ở nút bên dưới để lưu trữ và phổ biến nội bộ.",
    ],
  },
  {
    id: "cs-02",
    title:
      "Đà Nẵng ban hành kế hoạch phát triển công nghiệp vi mạch bán dẫn đến 2030",
    summary:
      "Thành phố đặt mục tiêu đào tạo 5.000 kỹ sư thiết kế vi mạch và thu hút các trung tâm R&D quốc tế.",
    topic: "su-kien",
    category: "tai-nguyen-chinh-sach",
    date: "12/07/2026",
    image: "https://picsum.photos/seed/dta-policy-2/800/450",
    tags: ["Vi mạch", "Kế hoạch thành phố"],
    views: 980,
    pdfUrl: "/documents/ke-hoach-vi-mach-2030.pdf",
    body: [
      "Kế hoạch nêu rõ các nhóm giải pháp về hạ tầng, nhân lực và ưu đãi đầu tư cho lĩnh vực bán dẫn.",
      "Tải văn bản đầy đủ ở nút bên dưới.",
    ],
  },
  {
    id: "nganh-01",
    title:
      "Từ suy nghĩ đến bàn phím: hành trình chuyển đổi số của một hội viên logistics",
    summary:
      "Bài chia sẻ của hội viên về việc số hóa toàn bộ quy trình kho vận trong 18 tháng.",
    topic: "su-kien",
    category: "tin-trong-nganh",
    date: "16/07/2026",
    image: "https://picsum.photos/seed/dta-nganh-1/800/450",
    tags: ["Hội viên", "Chuyển đổi số"],
    views: 2100,
    memberUrl: "https://example-member.vn",
    body: [
      "Chuyên mục diễn đàn của hội viên: mỗi bài viết là một giải pháp, một bài học thực tế từ chính doanh nghiệp trong hiệp hội.",
      "Xem chi tiết giải pháp tại website của hội viên theo liên kết bên dưới.",
    ],
  },
  {
    id: "nganh-02",
    title: "Giải pháp AI kiểm định chất lượng bo mạch của nhóm kỹ sư Đà Nẵng",
    summary:
      "Hệ thống thị giác máy tính giảm 70% thời gian kiểm định thủ công tại nhà máy đối tác.",
    topic: "su-kien",
    category: "tin-trong-nganh",
    date: "10/07/2026",
    image: "https://picsum.photos/seed/dta-nganh-2/800/450",
    tags: ["AI", "Sản xuất"],
    views: 1560,
    memberUrl: "https://example-member.vn",
    body: [
      "Bài giới thiệu thành tựu của hội viên trong lĩnh vực thị giác máy tính công nghiệp.",
    ],
  },
  {
    id: "dt-01",
    title:
      "Khai giảng khóa 'Thiết kế vi mạch cơ bản' phối hợp cùng Đại học Bách khoa",
    summary:
      "120 học viên là kỹ sư trẻ và sinh viên năm cuối tham gia khóa đào tạo 4 tháng.",
    topic: "digi-tech",
    category: "dao-tao",
    date: "15/07/2026",
    image: "https://picsum.photos/seed/dta-daotao-1/800/450",
    tags: ["Đào tạo", "Vi mạch"],
    views: 890,
    body: [
      "Chương trình nằm trong chuỗi hoạt động phát triển nguồn nhân lực Digi-Tech của hiệp hội.",
    ],
  },
  {
    id: "dt-02",
    title: "Bồi dưỡng kỹ năng an toàn thông tin cho doanh nghiệp nhỏ và vừa",
    summary:
      "Chuỗi workshop miễn phí cho hội viên về phòng chống lừa đảo và bảo mật dữ liệu khách hàng.",
    topic: "digi-tech",
    category: "dao-tao",
    date: "08/07/2026",
    image: "https://picsum.photos/seed/dta-daotao-2/800/450",
    tags: ["An toàn thông tin", "SME"],
    views: 640,
    body: ["Đăng ký tham dự qua Văn phòng số của hiệp hội."],
  },
  {
    id: "td-01",
    title:
      "[Thực tập sinh] Hội viên FPT Software tuyển 40 thực tập sinh AI/Data",
    summary:
      "Chương trình thực tập có lương 3 tháng, cơ hội ký hợp đồng chính thức sau khi tốt nghiệp.",
    topic: "digi-tech",
    category: "tuyen-dung",
    date: "17/07/2026",
    image: "https://picsum.photos/seed/dta-td-1/800/450",
    tags: ["Thực tập sinh", "AI"],
    views: 3200,
    isIntern: true,
    memberUrl: "https://example-member.vn/tuyen-dung",
    body: [
      "Tin tuyển dụng do hội viên cung cấp. Ứng viên nộp hồ sơ trực tiếp theo liên kết của doanh nghiệp.",
    ],
  },
  {
    id: "td-02",
    title:
      "Tổng hợp nhu cầu tuyển dụng hội viên tháng 7: 250+ vị trí công nghệ",
    summary:
      "Backend, kiểm thử, thiết kế vi mạch và kỹ sư cầu nối tiếng Nhật là các nhóm cần tuyển nhiều nhất.",
    topic: "digi-tech",
    category: "tuyen-dung",
    date: "05/07/2026",
    image: "https://picsum.photos/seed/dta-td-2/800/450",
    tags: ["Tuyển dụng", "Tổng hợp"],
    views: 1870,
    body: ["Danh sách chi tiết cập nhật hằng tuần từ các hội viên."],
  },
  {
    id: "mnc-01",
    title: "Từ DSA đến DTA: hai thập kỷ đồng hành cùng công nghệ số Đà Nẵng",
    summary:
      "Nhìn lại chặng đường từ Hiệp hội Doanh nghiệp Phần mềm đến Hiệp hội Công nghệ số thành phố.",
    topic: "mai-nha-chung",
    category: "tu-dsa-den-dta",
    date: "01/07/2026",
    image: "https://picsum.photos/seed/dta-mnc-1/800/450",
    tags: ["Lịch sử", "DSA"],
    views: 1420,
    body: [
      "Bài viết giới thiệu lịch sử hình thành, sứ mệnh và danh sách Ban Chấp hành – Ban Kiểm tra các nhiệm kỳ.",
    ],
  },
  {
    id: "mnc-02",
    title: "Chào mừng 3 hội viên mới gia nhập mái nhà chung DTA",
    summary:
      "Cộng đồng DTA tiếp tục mở rộng với các doanh nghiệp về AI, thương mại điện tử và an ninh mạng.",
    topic: "mai-nha-chung",
    category: "cong-dong",
    date: "14/07/2026",
    image: "https://picsum.photos/seed/dta-mnc-2/800/450",
    tags: ["Hội viên mới"],
    views: 760,
    body: [
      "Mỗi hội viên có trang tự giới thiệu riêng, tự cập nhật qua tài khoản và được tòa soạn duyệt trước khi xuất bản.",
    ],
  },
  {
    id: "mnc-03",
    title:
      "Chương trình 'Máy tính cũ – Tri thức mới' trao 60 bộ máy cho trường vùng cao",
    summary:
      "Hoạt động thiện nguyện thường niên của cộng đồng DTA tại huyện Nam Trà My.",
    topic: "mai-nha-chung",
    category: "xa-hoi",
    date: "06/07/2026",
    image: "https://picsum.photos/seed/dta-mnc-3/800/450",
    tags: ["Thiện nguyện"],
    views: 980,
    body: ["Tin hoạt động xã hội của hội viên và hiệp hội."],
  },
  {
    id: "dn-01",
    title: "Đà Nẵng vào top 3 thành phố hấp dẫn kỹ sư công nghệ nhất Việt Nam",
    summary:
      "Khảo sát thị trường nhân lực quý II ghi nhận mức tăng trưởng tuyển dụng 18% của thành phố.",
    topic: "da-nang-24h",
    category: "tin-tuc",
    date: "19/07/2026",
    image: "https://picsum.photos/seed/dta-dn-1/800/450",
    tags: ["Đà Nẵng", "Nhân lực"],
    views: 2650,
    body: [
      "Góc nhìn của hiệp hội về sự phát triển của hệ sinh thái công nghệ thành phố.",
    ],
  },
  {
    id: "dn-02",
    title: "DevDay Đà Nẵng 2026 công bố chủ đề: 'AI cho miền Trung số'",
    summary:
      "Sự kiện công nghệ thường niên lớn nhất miền Trung dự kiến đón hơn 5.000 lượt tham dự.",
    topic: "da-nang-24h",
    category: "su-kien-sap-den",
    date: "11/07/2026",
    image: "https://picsum.photos/seed/dta-dn-2/800/450",
    tags: ["DevDay", "Sự kiện"],
    views: 1980,
    body: ["Lịch sự kiện công nghệ số tại Đà Nẵng do hiệp hội tổng hợp."],
  },
  {
    id: "dn-03",
    title: "Ngày hội việc làm CNTT 2026: 60 doanh nghiệp, 1.500 vị trí",
    summary:
      "Sự kiện kết nối việc làm diễn ra tại Công viên Phần mềm Đà Nẵng cuối tháng 8.",
    topic: "da-nang-24h",
    category: "su-kien-sap-den",
    date: "03/07/2026",
    image: "https://picsum.photos/seed/dta-dn-3/800/450",
    tags: ["Việc làm", "Sự kiện"],
    views: 1120,
    body: [
      "Thông tin đăng ký gian hàng dành cho hội viên sẽ cập nhật tại đây.",
    ],
  },
];

export interface BoardMember {
  name: string;
  role: string;
  board: "bch" | "kiem-tra";
  photo: string;
}

/* <!-- mock --> Placeholder names/photos until the association provides the
   official list — the layout slot (photo + name + title above the footer) is
   what the brief mandates. */
export const boardMembers: BoardMember[] = [
  {
    name: "Nguyễn Văn A",
    role: "Chủ tịch",
    board: "bch",
    photo: "https://picsum.photos/seed/bch-1/200/200",
  },
  {
    name: "Trần Thị B",
    role: "Phó Chủ tịch",
    board: "bch",
    photo: "https://picsum.photos/seed/bch-2/200/200",
  },
  {
    name: "Lê Văn C",
    role: "Phó Chủ tịch",
    board: "bch",
    photo: "https://picsum.photos/seed/bch-3/200/200",
  },
  {
    name: "Phạm Thị D",
    role: "Tổng Thư ký",
    board: "bch",
    photo: "https://picsum.photos/seed/bch-4/200/200",
  },
  {
    name: "Hoàng Văn E",
    role: "Ủy viên",
    board: "bch",
    photo: "https://picsum.photos/seed/bch-5/200/200",
  },
  {
    name: "Võ Thị F",
    role: "Trưởng Ban Kiểm tra",
    board: "kiem-tra",
    photo: "https://picsum.photos/seed/kt-1/200/200",
  },
  {
    name: "Đặng Văn G",
    role: "Ủy viên Ban Kiểm tra",
    board: "kiem-tra",
    photo: "https://picsum.photos/seed/kt-2/200/200",
  },
];

/** Helpers shared by the portal pages. */
export function topicBySlug(slug: string) {
  return mainTopics.find((t) => t.slug === slug);
}

export function categoryBySlug(topicSlug: string, categorySlug: string) {
  return topicBySlug(topicSlug)?.categories.find(
    (c) => c.slug === categorySlug,
  );
}

export function articlesByTopic(topicSlug: string) {
  return portalArticles.filter((a) => a.topic === topicSlug);
}

export function articlesByCategory(topicSlug: string, categorySlug: string) {
  const list = portalArticles.filter(
    (a) => a.topic === topicSlug && a.category === categorySlug,
  );
  // Recruitment: intern posts first, per the brief.
  return categorySlug === "tuyen-dung"
    ? [...list].sort(
        (a, b) => Number(b.isIntern ?? false) - Number(a.isIntern ?? false),
      )
    : list;
}

const parseDate = (d: string) => {
  const [dd, mm, yyyy] = d.split("/").map(Number);
  return new Date(yyyy, mm - 1, dd).getTime();
};

export function latestArticles(n = 5) {
  return [...portalArticles]
    .sort((a, b) => parseDate(b.date) - parseDate(a.date))
    .slice(0, n);
}

export function mostReadArticles(n = 5) {
  return [...portalArticles].sort((a, b) => b.views - a.views).slice(0, n);
}
