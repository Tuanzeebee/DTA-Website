import { createCollectionStore, genId } from "./collectionStore";

/**
 * Domain data for the four admin ops pages. All seeds are MOCK rows
 * (<!-- mock -->) so every screen demos with content; real records replace
 * them the moment the user edits (the whole list then lives in
 * localStorage).
 */

/* ---------------- Hội phí & Tài chính ---------------- */

export interface FeeRecord {
  id: string;
  memberName: string;
  year: number;
  /** VND */
  amount: number;
  status: "paid" | "pending" | "exempt";
  paidDate?: string;
  note?: string;
}

export const FEE_STATUS_LABEL: Record<FeeRecord["status"], string> = {
  paid: "Đã nộp",
  pending: "Chờ nộp",
  exempt: "Miễn phí",
};

export const feeStore = createCollectionStore<FeeRecord>("dta-admin-fees", [
  {
    id: "fee-01",
    memberName: "Công ty Cổ phần FPT (Chi nhánh Đà Nẵng)",
    year: 2026,
    amount: 10_000_000,
    status: "paid",
    paidDate: "15/01/2026",
  },
  {
    id: "fee-02",
    memberName: "Công ty Cổ phần Enouvo",
    year: 2026,
    amount: 10_000_000,
    status: "paid",
    paidDate: "02/02/2026",
  },
  {
    id: "fee-03",
    memberName: "BAP IT Co., Ltd",
    year: 2026,
    amount: 10_000_000,
    status: "pending",
  },
  {
    id: "fee-04",
    memberName: "Tổng Công ty Giải pháp Doanh nghiệp Viettel (Đà Nẵng)",
    year: 2026,
    amount: 10_000_000,
    status: "pending",
  },
  {
    id: "fee-05",
    memberName: "Trường Đại học Bách khoa – Đại học Đà Nẵng",
    year: 2026,
    amount: 0,
    status: "exempt",
    note: "Viện trường — miễn hội phí theo điều lệ",
  },
  {
    id: "fee-06",
    memberName: "PGS. TS. Nguyễn Thanh Bình",
    year: 2026,
    amount: 2_000_000,
    status: "paid",
    paidDate: "20/01/2026",
  },
]);

/* ---------------- Ấn phẩm & Tài nguyên ---------------- */

export interface ResourceDoc {
  id: string;
  title: string;
  /** Số hiệu văn bản, ví dụ "47/2026/TT-BKHCN". */
  code?: string;
  category:
    "thong-tu" | "nghi-dinh" | "quyet-dinh" | "bieu-mau" | "an-pham" | "khac";
  date: string;
  /** URL hoặc data URL của file PDF. */
  fileUrl: string;
  desc?: string;
}

export const RESOURCE_CATEGORIES: {
  value: ResourceDoc["category"];
  label: string;
}[] = [
  { value: "thong-tu", label: "Thông tư" },
  { value: "nghi-dinh", label: "Nghị định" },
  { value: "quyet-dinh", label: "Quyết định" },
  { value: "bieu-mau", label: "Biểu mẫu" },
  { value: "an-pham", label: "Ấn phẩm DTA" },
  { value: "khac", label: "Khác" },
];

export const resourceStore = createCollectionStore<ResourceDoc>(
  "dta-admin-resources",
  [
    {
      id: "res-01",
      title: "Thông tư hướng dẫn định danh điện tử cho doanh nghiệp",
      code: "12/2026/TT-BKHCN",
      category: "thong-tu",
      date: "09/07/2026",
      fileUrl: "/documents/thong-tu-dinh-danh-dien-tu.pdf",
      desc: "Toàn văn thông tư kèm phụ lục biểu mẫu.",
    },
    {
      id: "res-02",
      title: "Nghị định về giao dịch điện tử (toàn văn)",
      code: "45/2026/NĐ-CP",
      category: "nghi-dinh",
      date: "18/07/2026",
      fileUrl: "/documents/nghi-dinh-giao-dich-dien-tu.pdf",
    },
    {
      id: "res-03",
      title: "Biểu mẫu đăng ký gia nhập Hiệp hội (bản Word + PDF)",
      category: "bieu-mau",
      date: "01/06/2026",
      fileUrl: "/documents/bieu-mau-gia-nhap-dta.pdf",
      desc: "Dành cho tổ chức và cá nhân nộp hồ sơ gia nhập.",
    },
    {
      id: "res-04",
      title: "Ấn phẩm quý II/2026: Toàn cảnh công nghệ số Đà Nẵng",
      category: "an-pham",
      date: "30/06/2026",
      fileUrl: "/documents/an-pham-quy-2-2026.pdf",
    },
  ],
);

/* ---------------- Diễn đàn phản biện ---------------- */

export interface ForumSubmission {
  id: string;
  title: string;
  memberName: string;
  /** Bài chủ yếu gửi qua link (website hội viên / Google Docs…). */
  link: string;
  note?: string;
  date: string;
  status: "pending" | "approved" | "rejected";
}

export const SUBMISSION_STATUS_LABEL: Record<
  ForumSubmission["status"],
  string
> = {
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
};

export const forumStore = createCollectionStore<ForumSubmission>(
  "dta-admin-forum",
  [
    {
      id: "sub-01",
      title: "Đề xuất cơ chế chia sẻ dữ liệu mở giữa các sở ngành",
      memberName: "Công ty Cổ phần Enouvo",
      link: "https://example-member.vn/de-xuat-du-lieu-mo",
      note: "Bài phản biện cho dự thảo kế hoạch dữ liệu mở của thành phố.",
      date: "20/07/2026",
      status: "pending",
    },
    {
      id: "sub-02",
      title: "Góp ý dự thảo quy chế sandbox fintech từ góc nhìn doanh nghiệp",
      memberName: "BAP IT Co., Ltd",
      link: "https://example-member.vn/gop-y-sandbox",
      date: "18/07/2026",
      status: "pending",
    },
    {
      id: "sub-03",
      title: "Báo cáo khảo sát lương ngành CNTT Đà Nẵng 2026",
      memberName: "PGS. TS. Nguyễn Thanh Bình",
      link: "https://example-member.vn/bao-cao-luong-2026",
      note: "Đã đăng bản rút gọn ở chuyên mục Tin trong ngành.",
      date: "10/07/2026",
      status: "approved",
    },
  ],
);

/* ---------------- Đăng ký hội viên mới ---------------- */

export interface MemberApplication {
  id: string;
  orgName: string;
  contactName: string;
  email: string;
  phone?: string;
  type: "organization" | "individual";
  domain?: string;
  message?: string;
  date: string;
  status: "pending" | "approved" | "rejected";
}

export const APPLICATION_STATUS_LABEL: Record<
  MemberApplication["status"],
  string
> = {
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
};

export const applicationStore = createCollectionStore<MemberApplication>(
  "dta-admin-applications",
  [
    {
      id: "app-01",
      orgName: "Công ty TNHH Rockship Việt Nam",
      contactName: "Trần Quốc Bảo",
      email: "bao.tran@rockship.example",
      phone: "0905 123 456",
      type: "organization",
      domain: "Phát triển ứng dụng AI cho thương mại điện tử",
      message:
        "Chúng tôi muốn gia nhập DTA để kết nối với cộng đồng doanh nghiệp công nghệ Đà Nẵng và tham gia các chương trình đào tạo nhân lực.",
      date: "21/07/2026",
      status: "pending",
    },
    {
      id: "app-02",
      orgName: "Green Cloud JSC",
      contactName: "Lê Thị Hạnh",
      email: "hanh.le@greencloud.example",
      phone: "0912 888 999",
      type: "organization",
      domain: "Hạ tầng đám mây tiết kiệm năng lượng",
      date: "19/07/2026",
      status: "pending",
    },
    {
      id: "app-03",
      orgName: "TS. Phan Minh Đức",
      contactName: "Phan Minh Đức",
      email: "duc.phan@univ.example",
      type: "individual",
      domain: "Nghiên cứu bảo mật hệ thống nhúng",
      message: "Đăng ký hội viên cá nhân, mảng an toàn thông tin.",
      date: "16/07/2026",
      status: "approved",
    },
  ],
);

export { genId };
