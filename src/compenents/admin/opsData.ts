import { createCollectionStore, genId } from "./collectionStore";

/**
 * Domain data for the admin ops pages. All seeds are MOCK rows
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

export const feeStore = createCollectionStore<FeeRecord>("dta-admin-fees", []);

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
  [],
);

/* ---------------- Quảng cáo & Banner ---------------- */

/**
 * Vị trí hiển thị trên trang tin:
 * - `banner`  — banner lớn đầu trang (tuyên truyền / trả phí), dải ngang 2/3.
 * - `ad`      — ô quảng cáo nhỏ bên phải banner (trên).
 * - `sponsor` — ô tài trợ nhỏ bên phải banner (dưới).
 * - `sidebar` — các banner dọc xếp chồng ở cột 3 (trang chuyên mục, bài đọc).
 */
export type AdSlot = "banner" | "ad" | "sponsor" | "sidebar";

export interface AdPlacement {
  id: string;
  /** Tên chiến dịch / đơn vị quảng cáo — hiển thị trong admin và alt ảnh. */
  title: string;
  slot: AdSlot;
  /** URL hoặc data URL của ảnh quảng cáo. */
  imageUrl: string;
  /** Trang đích mở ra khi độc giả bấm vào ảnh. */
  linkUrl: string;
  /** Tắt để gỡ khỏi trang tin mà không xóa dữ liệu. */
  active: boolean;
  note?: string;
}

export const AD_SLOTS: { value: AdSlot; label: string }[] = [
  { value: "banner", label: "Banner lớn đầu trang" },
  { value: "ad", label: "Ô quảng cáo (phải banner, trên)" },
  { value: "sponsor", label: "Ô tài trợ (phải banner, dưới)" },
  { value: "sidebar", label: "Quảng cáo cột phải" },
];

export const adSlotLabel = (slot: AdSlot) =>
  AD_SLOTS.find((s) => s.value === slot)?.label ?? slot;

/** Các quảng cáo đang BẬT của một vị trí — trang tin đọc qua hàm này. */
export const activeAdsForSlot = (ads: AdPlacement[], slot: AdSlot) =>
  ads.filter((a) => a.active && a.slot === slot);

export const adStore = createCollectionStore<AdPlacement>("dta-admin-ads", []);

export { genId };
