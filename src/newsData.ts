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

/**
 * Inline image block inside an article body — modelled on Word's Layout
 * Options, per the plan's editor spec ("cho phép đặt ảnh trái, phải, hoặc
 * ngay giữa bài; có tham số tùy chọn"):
 *  - align: horizontal anchor (trái / phải / giữa)
 *  - wrap:  "square" = text wraps around the image (Word: Square);
 *           "none"   = image sits on its own line (Word: Top and Bottom).
 *           Defaults: square for left/right, none for center.
 *  - width: editor-chosen size as % of the column (default 46 when text
 *           wraps, 100 for own-line images).
 */
export interface ArticleImage {
  src: string;
  caption?: string;
  align: "left" | "right" | "center";
  wrap?: "square" | "none";
  width?: number;
}

/** Highlight box between paragraphs ("điểm nhấn giữa bài (BOX)" in the
 *  plan) — pull quotes, key numbers, editorial notes. */
export interface ArticleBox {
  box: string;
}

/** A body entry: plain string = paragraph; image and box blocks interleave
 *  in any order the editor wants. */
export type ArticleBlock = string | ArticleImage | ArticleBox;

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
  /** Shown right-aligned at the end of the article; defaults to the
   *  editorial board when absent. */
  author?: string;
  body: ArticleBlock[];
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
    author: "Minh Châu",
    body: [
      "Văn bản quy định chi tiết về giá trị pháp lý của chữ ký điện tử chuyên dùng và điều kiện bảo đảm an toàn. Đây là khung pháp lý được cộng đồng doanh nghiệp chờ đợi từ lâu, bởi phần lớn giao dịch B2B trong ngành công nghệ số hiện đã được thực hiện hoàn toàn trên môi trường điện tử.",
      {
        src: "https://picsum.photos/seed/dta-policy-1b/700/420",
        caption: "Lễ công bố nghị định tại Hà Nội. Ảnh: minh họa",
        align: "right",
        width: 40,
      },
      "Điểm thay đổi lớn nhất nằm ở nhóm quy định về định danh điện tử: doanh nghiệp được phép sử dụng tài khoản định danh mức 2 thay cho bản sao công chứng trong hầu hết thủ tục hành chính. Thời gian xử lý hồ sơ, theo tính toán của Sở, có thể giảm tới 60%.",
      {
        box: "Con số đáng chú ý: 60% thời gian xử lý hồ sơ được cắt giảm khi doanh nghiệp dùng định danh điện tử mức 2 thay cho bản sao công chứng.",
      },
      "Với nhóm quy định về lưu trữ chứng từ, văn bản lần đầu công nhận giá trị chứng cứ của thông điệp dữ liệu được lưu trên hạ tầng đám mây đặt tại Việt Nam, kèm điều kiện về sao lưu và toàn vẹn dữ liệu.",
      {
        src: "https://picsum.photos/seed/dta-policy-1c/900/500",
        caption:
          "Doanh nghiệp hội viên trải nghiệm quy trình ký số mới tại Văn phòng số DTA.",
        align: "center",
      },
      "Ban Chính sách của Hiệp hội sẽ tổ chức buổi phổ biến trực tuyến trong tháng tới; hội viên đăng ký qua Văn phòng số. Hội viên có thể tải toàn văn văn bản (PDF) ở nút bên dưới để lưu trữ và phổ biến nội bộ.",
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
  /* <!-- mock --> cs-03..cs-10: extra sample rows so the policy library
     exceeds ARTICLES_PAGE_SIZE and the pagination/filter UI is visible.
     A few intentionally have no pdfUrl so the "Có văn bản PDF" chip
     visibly narrows the list. */
  {
    id: "cs-03",
    title: "Thông tư hướng dẫn định danh điện tử cho doanh nghiệp có hiệu lực",
    summary:
      "Doanh nghiệp dùng tài khoản định danh mức 2 để thực hiện toàn bộ thủ tục hành chính trực tuyến.",
    topic: "su-kien",
    category: "tai-nguyen-chinh-sach",
    date: "09/07/2026",
    image: "https://picsum.photos/seed/dta-policy-3/800/450",
    tags: ["Chính sách", "Định danh điện tử"],
    views: 720,
    pdfUrl: "/documents/thong-tu-dinh-danh-dien-tu.pdf",
    body: ["Toàn văn thông tư tải ở nút bên dưới."],
  },
  {
    id: "cs-04",
    title: "Quy định mới về bảo vệ dữ liệu cá nhân: lộ trình tuân thủ 12 tháng",
    summary:
      "Các doanh nghiệp xử lý dữ liệu khách hàng cần hoàn tất đánh giá tác động trước quý II năm sau.",
    topic: "su-kien",
    category: "tai-nguyen-chinh-sach",
    date: "05/07/2026",
    image: "https://picsum.photos/seed/dta-policy-4/800/450",
    tags: ["Dữ liệu cá nhân", "Tuân thủ"],
    views: 1890,
    pdfUrl: "/documents/quy-dinh-bao-ve-du-lieu.pdf",
    body: ["Hiệp hội sẽ tổ chức workshop hướng dẫn tuân thủ cho hội viên."],
  },
  {
    id: "cs-05",
    title: "Đà Nẵng miễn giảm tiền thuê hạ tầng CNTT cho startup năm đầu",
    summary:
      "Chính sách ưu đãi mới áp dụng cho doanh nghiệp công nghệ thành lập dưới 3 năm tại các khu CNTT tập trung.",
    topic: "su-kien",
    category: "tai-nguyen-chinh-sach",
    date: "02/07/2026",
    image: "https://picsum.photos/seed/dta-policy-5/800/450",
    tags: ["Ưu đãi", "Startup"],
    views: 2440,
    body: ["Chi tiết điều kiện áp dụng liên hệ Văn phòng hiệp hội."],
  },
  {
    id: "cs-06",
    title: "Khung tiêu chí đánh giá mức độ chuyển đổi số doanh nghiệp 2026",
    summary:
      "Bộ tiêu chí gồm 6 trụ cột giúp doanh nghiệp tự chấm điểm mức độ trưởng thành số.",
    topic: "su-kien",
    category: "tai-nguyen-chinh-sach",
    date: "28/06/2026",
    image: "https://picsum.photos/seed/dta-policy-6/800/450",
    tags: ["Chuyển đổi số", "Tiêu chí"],
    views: 1350,
    pdfUrl: "/documents/khung-tieu-chi-cds-2026.pdf",
    body: ["Tải bộ tiêu chí đầy đủ ở nút bên dưới."],
  },
  {
    id: "cs-07",
    title: "Hướng dẫn đăng ký sandbox fintech cho doanh nghiệp công nghệ",
    summary:
      "Cơ chế thử nghiệm có kiểm soát mở đăng ký đợt hai với 4 nhóm giải pháp tài chính số.",
    topic: "su-kien",
    category: "tai-nguyen-chinh-sach",
    date: "24/06/2026",
    image: "https://picsum.photos/seed/dta-policy-7/800/450",
    tags: ["Fintech", "Sandbox"],
    views: 560,
    pdfUrl: "/documents/huong-dan-sandbox-fintech.pdf",
    body: ["Hồ sơ đăng ký nộp trực tuyến trước ngày 15/8."],
  },
  {
    id: "cs-08",
    title: "Chính sách thuế mới cho hoạt động xuất khẩu phần mềm từ 2027",
    summary:
      "Tổng hợp các thay đổi về ưu đãi thuế thu nhập doanh nghiệp đối với dịch vụ phần mềm xuất khẩu.",
    topic: "su-kien",
    category: "tai-nguyen-chinh-sach",
    date: "20/06/2026",
    image: "https://picsum.photos/seed/dta-policy-8/800/450",
    tags: ["Thuế", "Xuất khẩu phần mềm"],
    views: 3010,
    body: ["Hiệp hội đang tổng hợp ý kiến hội viên để kiến nghị điều chỉnh."],
  },
  {
    id: "cs-09",
    title: "Quy chuẩn kỹ thuật quốc gia về an toàn thông tin mạng cập nhật",
    summary:
      "Phiên bản mới bổ sung yêu cầu đối với hệ thống dùng AI và dịch vụ điện toán đám mây.",
    topic: "su-kien",
    category: "tai-nguyen-chinh-sach",
    date: "15/06/2026",
    image: "https://picsum.photos/seed/dta-policy-9/800/450",
    tags: ["An toàn thông tin", "Quy chuẩn"],
    views: 830,
    pdfUrl: "/documents/quy-chuan-attt-2026.pdf",
    body: ["Toàn văn quy chuẩn tải ở nút bên dưới."],
  },
  {
    id: "cs-10",
    title: "Đề án phát triển kinh tế số Đà Nẵng: mục tiêu 30% GRDP đến 2030",
    summary:
      "Thành phố công bố lộ trình ba giai đoạn với 25 nhiệm vụ trọng tâm về kinh tế số.",
    topic: "su-kien",
    category: "tai-nguyen-chinh-sach",
    date: "10/06/2026",
    image: "https://picsum.photos/seed/dta-policy-10/800/450",
    tags: ["Kinh tế số", "Đề án"],
    views: 1670,
    pdfUrl: "/documents/de-an-kinh-te-so-danang.pdf",
    body: ["Tải toàn văn đề án ở nút bên dưới."],
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
    author: "Hội viên DTA Logistics",
    body: [
      "Chuyên mục diễn đàn của hội viên: mỗi bài viết là một giải pháp, một bài học thực tế từ chính doanh nghiệp trong hiệp hội. Câu chuyện kỳ này đến từ một hội viên ngành logistics với 18 tháng số hóa toàn bộ quy trình kho vận.",
      {
        src: "https://picsum.photos/seed/dta-nganh-1b/700/420",
        caption: "Kho hàng trước khi số hóa: giấy tờ ở mọi công đoạn.",
        align: "left",
      },
      "Xuất phát điểm không hề thuận lợi: 100% lệnh xuất nhập kho viết tay, đối soát cuối ngày mất trung bình 3 giờ, sai lệch tồn kho có tháng lên tới 4%. Đội dự án bắt đầu bằng việc nhỏ nhất — chuẩn hóa mã hàng — trước khi nghĩ đến bất kỳ phần mềm nào.",
      "Sáu tháng đầu tiên dành trọn cho dữ liệu nền, trước khi bất kỳ dòng code nào được viết.",
      {
        box: "“Chuyển đổi số thất bại không phải vì công nghệ, mà vì dữ liệu đầu vào không sạch.” — đại diện doanh nghiệp chia sẻ tại diễn đàn.",
      },
      {
        src: "https://picsum.photos/seed/dta-nganh-1c/900/500",
        caption:
          "Trung tâm điều hành kho vận sau 18 tháng: mọi chỉ số hiển thị thời gian thực.",
        align: "center",
      },
      "Giai đoạn hai triển khai hệ thống quản lý kho (WMS) do một hội viên khác trong Hiệp hội phát triển — một ví dụ điển hình của mô hình 'hội viên dùng giải pháp hội viên' mà chuyên mục Nối vòng tay lớn thúc đẩy.",
      {
        src: "https://picsum.photos/seed/dta-nganh-1d/700/420",
        caption: "Nhân viên vận hành chỉ cần một máy quét và một màn hình.",
        align: "right",
        width: 38,
      },
      "Kết quả sau 18 tháng: thời gian đối soát còn 15 phút, sai lệch tồn kho dưới 0,3%, và quan trọng nhất — đội ngũ 40 nhân sự kho không ai phải nghỉ việc, tất cả được đào tạo lại cho vai trò mới. Xem chi tiết giải pháp tại website của hội viên theo liên kết bên dưới.",
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
  /* <!-- mock --> td-03..td-07: extra recruitment rows — pushes the category
     past one page AND demonstrates intern pinning (td-05 is an intern post
     with an old date: it still sits above every non-intern row). */
  {
    id: "td-03",
    title: "Hội viên Enouvo tuyển 12 lập trình viên React Native",
    summary:
      "Yêu cầu 2 năm kinh nghiệm, làm việc tại văn phòng Đà Nẵng hoặc hybrid.",
    topic: "digi-tech",
    category: "tuyen-dung",
    date: "14/07/2026",
    image: "https://picsum.photos/seed/dta-td-3/800/450",
    tags: ["Tuyển dụng", "Mobile"],
    views: 940,
    memberUrl: "https://example-member.vn/tuyen-dung",
    body: ["Ứng viên nộp hồ sơ theo liên kết của doanh nghiệp."],
  },
  {
    id: "td-04",
    title: "Tuyển kỹ sư kiểm thử tự động cho dự án tài chính Nhật Bản",
    summary:
      "Hội viên BAP cần 8 QA engineer biết tiếng Nhật N3 trở lên, đãi ngộ cạnh tranh.",
    topic: "digi-tech",
    category: "tuyen-dung",
    date: "12/07/2026",
    image: "https://picsum.photos/seed/dta-td-4/800/450",
    tags: ["Tuyển dụng", "QA"],
    views: 720,
    memberUrl: "https://example-member.vn/tuyen-dung",
    body: ["Ứng viên nộp hồ sơ theo liên kết của doanh nghiệp."],
  },
  {
    id: "td-05",
    title: "[Thực tập sinh] Chương trình thực tập thiết kế vi mạch khóa 2",
    summary:
      "Hội viên Acronics nhận 15 sinh viên năm cuối ngành điện tử — có phụ cấp và mentor 1:1.",
    topic: "digi-tech",
    category: "tuyen-dung",
    date: "01/07/2026",
    image: "https://picsum.photos/seed/dta-td-5/800/450",
    tags: ["Thực tập sinh", "Vi mạch"],
    views: 1150,
    isIntern: true,
    memberUrl: "https://example-member.vn/tuyen-dung",
    body: ["Tin tuyển dụng do hội viên cung cấp."],
  },
  {
    id: "td-06",
    title: "Viettel Đà Nẵng tuyển 10 kỹ sư vận hành Data Center",
    summary:
      "Ưu tiên ứng viên có chứng chỉ CCNA/CCNP, làm việc theo ca tại trạm Hòa Cầm.",
    topic: "digi-tech",
    category: "tuyen-dung",
    date: "28/06/2026",
    image: "https://picsum.photos/seed/dta-td-6/800/450",
    tags: ["Tuyển dụng", "Hạ tầng"],
    views: 530,
    body: ["Danh sách vị trí chi tiết cập nhật tại Văn phòng số."],
  },
  {
    id: "td-07",
    title: "Tổng hợp vị trí kỹ sư cầu nối (BrSE) tháng 6 từ các hội viên",
    summary:
      "18 vị trí BrSE tiếng Nhật với mức lương công bố từ 1.500 đến 3.500 USD.",
    topic: "digi-tech",
    category: "tuyen-dung",
    date: "20/06/2026",
    image: "https://picsum.photos/seed/dta-td-7/800/450",
    tags: ["Tuyển dụng", "BrSE"],
    views: 2280,
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
    body: [
      "Phóng sự ảnh: hành trình hai ngày của đoàn công tác xã hội DTA tại huyện Nam Trà My — nơi 60 bộ máy tính được tân trang từ chương trình 'Máy tính cũ – Tri thức mới' tìm được mái trường mới.",
      {
        src: "https://picsum.photos/seed/dta-mnc-3b/900/500",
        caption:
          "Đoàn xe xuất phát từ Công viên Phần mềm Đà Nẵng lúc 5 giờ sáng.",
        align: "center",
      },
      "Trước chuyến đi một tháng, đội kỹ thuật của các doanh nghiệp hội viên đã thay ổ cứng SSD, vệ sinh và cài đặt phần mềm học tập cho toàn bộ 60 máy — tổng cộng hơn 200 giờ công tình nguyện.",
      {
        src: "https://picsum.photos/seed/dta-mnc-3c/700/420",
        caption: "Kỹ sư hội viên lắp đặt phòng máy tại điểm trường Tắk Pổ.",
        align: "left",
      },
      "Tại điểm trường, các kỹ sư trẻ vừa lắp đặt vừa hướng dẫn thầy cô cách bảo trì cơ bản. Một phòng máy 20 chỗ hoàn thành chỉ trong buổi sáng.",
      {
        src: "https://picsum.photos/seed/dta-mnc-3d/700/420",
        caption: "Giờ tin học đầu tiên của các em học sinh lớp 4.",
        align: "right",
      },
      "Khoảnh khắc đáng nhớ nhất thuộc về giờ tin học đầu tiên: nhiều em lần đầu chạm vào chuột máy tính, và chỉ sau 20 phút đã tự mở được phần mềm tập vẽ.",
      {
        src: "https://picsum.photos/seed/dta-mnc-3e/900/500",
        caption:
          "Đoàn công tác chụp ảnh lưu niệm cùng thầy trò điểm trường trước khi rời Nam Trà My.",
        align: "center",
      },
      "Chương trình sẽ tiếp tục đợt hai vào cuối năm với mục tiêu 100 máy. Hội viên muốn đóng góp thiết bị hoặc nhân lực kỹ thuật liên hệ Văn phòng Hiệp hội.",
    ],
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
    author: "Quang Huy",
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
    body: [
      "Ban tổ chức DevDay Đà Nẵng vừa công bố chủ đề năm nay: 'AI cho miền Trung số' — tập trung vào ứng dụng trí tuệ nhân tạo trong doanh nghiệp vừa và nhỏ, chính quyền số và đào tạo nhân lực.",
      {
        src: "https://picsum.photos/seed/dta-dn-2b/700/420",
        caption: "Không khí DevDay năm trước với hơn 4.000 lượt tham dự.",
        align: "left",
      },
      "Sự kiện dự kiến đón hơn 5.000 lượt tham dự với 3 sân khấu song song: AI Engineering, Sản phẩm số và Nghề nghiệp công nghệ. Nhiều hội viên DTA đã đăng ký gian hàng tuyển dụng và trình diễn giải pháp.",
      "Hiệp hội là đơn vị đồng hành truyền thông của sự kiện; hội viên đăng ký gian hàng qua Văn phòng số sẽ được ưu tiên vị trí khu trung tâm.",
      {
        src: "https://picsum.photos/seed/dta-dn-2c/900/500",
        caption:
          "Phối cảnh khu triển lãm DevDay 2026 tại Cung Thể thao Tiên Sơn.",
        align: "right",
        wrap: "none",
        width: 75,
      },
      "Lịch chi tiết các phiên và diễn giả sẽ được cập nhật tại chuyên mục Sự kiện sắp đến ngay khi ban tổ chức công bố.",
    ],
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

/* ------------------------------------------------------------------ *
 * List engine: filter -> sort -> paginate.
 *
 * All list state lives in the URL (?sort=&flag=&page=) so pages are
 * shareable and the back button works; these helpers are pure functions
 * over that state. When a real backend arrives, the same query object
 * maps 1:1 onto API params and only queryArticles() changes.
 * ------------------------------------------------------------------ */

export const articleSorts = ["moi-nhat", "cu-nhat", "doc-nhieu"] as const;
export type ArticleSort = (typeof articleSorts)[number];
export const articleSortLabels: Record<ArticleSort, string> = {
  "moi-nhat": "Mới nhất",
  "cu-nhat": "Cũ nhất",
  "doc-nhieu": "Đọc nhiều",
};
export const DEFAULT_SORT: ArticleSort = "moi-nhat";

/** Facet filters derived from article capabilities, not editor tags. */
export const articleFlags = ["pdf", "thuc-tap", "lien-ket"] as const;
export type ArticleFlag = (typeof articleFlags)[number];
export const articleFlagLabels: Record<ArticleFlag, string> = {
  pdf: "Có văn bản PDF",
  "thuc-tap": "Thực tập sinh",
  "lien-ket": "Link hội viên",
};

const flagTest: Record<ArticleFlag, (a: PortalArticle) => boolean> = {
  pdf: (a) => Boolean(a.pdfUrl),
  "thuc-tap": (a) => Boolean(a.isIntern),
  "lien-ket": (a) => Boolean(a.memberUrl),
};

export const isArticleSort = (v: unknown): v is ArticleSort =>
  articleSorts.includes(v as ArticleSort);
export const isArticleFlag = (v: unknown): v is ArticleFlag =>
  articleFlags.includes(v as ArticleFlag);

const parseDate = (d: string) => {
  const [dd, mm, yyyy] = d.split("/").map(Number);
  return new Date(yyyy, mm - 1, dd).getTime();
};

/** dd/mm/yyyy -> ms, cached per article so sort comparators don't re-parse
 *  the string on every comparison (O(n log n) comparisons per sort). */
const dateMsCache = new WeakMap<PortalArticle, number>();
const dateMs = (a: PortalArticle) => {
  let ms = dateMsCache.get(a);
  if (ms === undefined) {
    ms = parseDate(a.date);
    dateMsCache.set(a, ms);
  }
  return ms;
};

const comparators: Record<
  ArticleSort,
  (a: PortalArticle, b: PortalArticle) => number
> = {
  "moi-nhat": (a, b) => dateMs(b) - dateMs(a),
  "cu-nhat": (a, b) => dateMs(a) - dateMs(b),
  "doc-nhieu": (a, b) => b.views - a.views,
};

/** Filtered + sorted (not yet paginated) list for one category — or a whole
 *  topic when categorySlug is omitted. */
function filterSort(
  topicSlug: string,
  categorySlug?: string,
  sort: ArticleSort = DEFAULT_SORT,
  flag?: ArticleFlag,
) {
  let list = portalArticles.filter(
    (a) =>
      a.topic === topicSlug &&
      (categorySlug === undefined || a.category === categorySlug),
  );
  if (flag) list = list.filter(flagTest[flag]);

  const cmp = comparators[sort];
  // Recruitment: intern posts stay pinned above the rest in EVERY sort
  // order, per the brief — sort applies within each group.
  const pinned =
    categorySlug === "tuyen-dung"
      ? (a: PortalArticle, b: PortalArticle) =>
          Number(b.isIntern ?? false) - Number(a.isIntern ?? false) || cmp(a, b)
      : cmp;
  return list.sort(pinned); // list is already a fresh array from filter()
}

/** Category list with the default policy (newest first, interns pinned) —
 *  used by pages that show a fixed teaser slice. */
export function articlesByCategory(topicSlug: string, categorySlug: string) {
  return filterSort(topicSlug, categorySlug);
}

export const ARTICLES_PAGE_SIZE = 6;

export interface ArticleQuery {
  topic: string;
  /** Omit to query across the whole topic (topic-page pagination). */
  category?: string;
  sort?: ArticleSort;
  flag?: ArticleFlag;
  page?: number;
  pageSize?: number;
}

export interface ArticlePageResult {
  items: PortalArticle[];
  /** Matches after filtering, before pagination. */
  total: number;
  /** Clamped to [1, pageCount] — a stale ?page=9 URL degrades gracefully. */
  page: number;
  pageCount: number;
}

export function queryArticles(q: ArticleQuery): ArticlePageResult {
  const sorted = filterSort(q.topic, q.category, q.sort, q.flag);
  const pageSize = q.pageSize ?? ARTICLES_PAGE_SIZE;
  const total = sorted.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, q.page ?? 1), pageCount);
  return {
    items: sorted.slice((page - 1) * pageSize, page * pageSize),
    total,
    page,
    pageCount,
  };
}

/** Flags that match at least one article in the category — lets the UI hide
 *  filter chips that could only ever produce an empty list. */
export function availableFlags(topicSlug: string, categorySlug: string) {
  const pool = portalArticles.filter(
    (a) => a.topic === topicSlug && a.category === categorySlug,
  );
  return articleFlags.filter((f) => pool.some(flagTest[f]));
}

/** Lowercase + strip Vietnamese diacritics, so "chinh sach" matches
 *  "chính sách". NFD splits base letters from combining marks; đ/Đ have no
 *  combining form and need their own replace. */
const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/đ/g, "d");

/** Searchable haystack per article, folded once and cached. */
const haystackCache = new WeakMap<PortalArticle, string>();
const haystack = (a: PortalArticle) => {
  let h = haystackCache.get(a);
  if (h === undefined) {
    const bodyText = a.body
      .map((b) =>
        typeof b === "string" ? b : "box" in b ? b.box : (b.caption ?? ""),
      )
      .join(" ");
    h = fold([a.title, a.summary, a.tags.join(" "), bodyText].join(" "));
    haystackCache.set(a, h);
  }
  return h;
};

/** Keyword search ("từ khóa - tìm kiếm" utility in the brief). Every
 *  whitespace-separated term must match (AND), newest first. */
export function searchArticles(query: string) {
  const terms = fold(query.trim()).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  return portalArticles
    .filter((a) => terms.every((t) => haystack(a).includes(t)))
    .sort(comparators["moi-nhat"]);
}

/** Same-category articles for the article-page rail (5 per the brief —
 *  the count is meant to be admin-configurable, hence the parameter). */
export function relatedArticles(article: PortalArticle, n = 5) {
  return filterSort(article.topic, article.category)
    .filter((a) => a.id !== article.id)
    .slice(0, n);
}

export function latestArticles(n = 5) {
  return [...portalArticles].sort(comparators["moi-nhat"]).slice(0, n);
}

export function mostReadArticles(n = 5) {
  return [...portalArticles].sort(comparators["doc-nhieu"]).slice(0, n);
}
