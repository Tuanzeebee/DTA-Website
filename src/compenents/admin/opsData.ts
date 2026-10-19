import { createCollectionStore, genId } from "./collectionStore";

/**
 * Domain data for the admin ops pages. Seeds are empty — real data comes
 * from the backend API. The ad placement store has been migrated to the
 * backend (Prisma AdPlacement model).
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

export const feeStore = createCollectionStore<FeeRecord>("dta-admin-fees", []);

/* ---------------- Ấn phẩm & Tài nguyên ---------------- */

export interface ResourceDoc {
  id: string;
  title: string;
  /** Số hiệu văn bản, ví dụ "47/2026/TT-BKHCN". */
  code?: string;
  category:
    | "thong-tu"
    | "nghi-dinh"
    | "quyet-dinh"
    | "bieu-mau"
    | "an-pham"
    | "khac";
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
  [],
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
  [],
);

/* ---------------- Đăng ký hội viên mới ---------------- */

export interface MemberApplication {
  id: string;
  orgName: string;
  /** Tên tiếng Anh (7 trường Danh bạ). */
  nameEn?: string;
  /** Loại hình trong nước / FDI. */
  ownership?: string;
  /** Lãnh đạo. */
  leader?: string;
  contactName: string;
  email: string;
  phone?: string;
  type: "organization" | "individual";
  domain?: string;
  /** Thế mạnh. */
  strengths?: string;
  /** Lĩnh vực công nghệ (AI/semi/cloud/iot). */
  techField?: string;
  /** Tên file công văn đồng ý làm Hội viên. */
  consentDocName?: string;
  /** Tên file GPKD / Quyết định thành lập. */
  legalDocName?: string;
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
  [],
);

/* ---------------- Quảng cáo & Banner ---------------- */

/**
 * Vị trí hiển thị trên trang tin:
 * - `banner`  — banner lớn đầu trang (tuyên truyền / trả phí), carousel.
 * - `sidebar` — các ô "Quảng cáo 1/2/3" xếp chồng ở cột phải (trang chuyên
 *               mục, bài đọc: 3 ô; tìm kiếm, đã lưu, trang tin: 1 ô).
 * Đồng bộ với IsIn của backend (ads/dto/ad.dto.ts).
 */
export type AdSlot = "banner" | "sidebar";

export interface AdPlacement {
  id: string;
  title: string;
  slot: AdSlot;
  imageUrl: string;
  linkUrl: string;
  active: boolean;
  note?: string;
}

export const AD_SLOTS: { value: AdSlot; label: string }[] = [
  { value: "banner", label: "Banner lớn đầu trang" },
  { value: "sidebar", label: "Quảng cáo cột phải (Quảng cáo 1/2/3)" },
];

export const adSlotLabel = (slot: AdSlot) =>
  AD_SLOTS.find((s) => s.value === slot)?.label ?? slot;

/** Các quảng cáo đang BẬT của một vị trí. */
export const activeAdsForSlot = (ads: AdPlacement[], slot: AdSlot) =>
  ads.filter((a) => a.active && a.slot === slot);

export { genId };
