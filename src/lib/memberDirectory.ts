import type { DtaMember, MemberContact, MemberOwnership } from "@/data";

/**
 * Mẫu nhập liệu Danh bạ hội viên — dùng chung cho:
 * - portal/dang-ky Step 1 (người mới nộp đơn)
 * - portal ProfilePanel "Chúng tôi nói về mình" (hội viên tự cập nhật)
 * - admin MemberEditor (quản trị nhập hộ / sửa — không bắt buộc)
 *
 * Theo góp ý 10/2026, mỗi thẻ hội viên gồm: tên Việt/Anh, lĩnh vực, thế mạnh,
 * lãnh đạo + SĐT + email, cán bộ đầu mối + SĐT + email, địa chỉ.
 * Ở đăng ký / hồ sơ hội viên: tất cả đều bắt buộc.
 */

export interface MemberDirectoryForm {
  /** Tên công ty tiếng Việt (= DtaMember.name). */
  nameVi: string;
  /** Tên công ty tiếng Anh (= DtaMember.nameEn). */
  nameEn: string;
  /** Loại hình: trong nước hay FDI. */
  ownership: MemberOwnership | "";
  /** Lĩnh vực hoạt động (= DtaMember.domain). */
  field: string;
  /** Thế mạnh / năng lực nổi bật. */
  strengths: string;
  /** Lãnh đạo / người đại diện. */
  leader: string;
  /** Điện thoại lãnh đạo. */
  phone: string;
  leaderEmail: string;
  /** Cán bộ / chuyên viên quản lý — đầu mối tương tác. */
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
}

export const EMPTY_DIRECTORY_FORM: MemberDirectoryForm = {
  nameVi: "",
  nameEn: "",
  ownership: "",
  field: "",
  strengths: "",
  leader: "",
  phone: "",
  leaderEmail: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  address: "",
};

export const VN_LABEL: Record<keyof MemberDirectoryForm, string> = {
  nameVi: "Tên công ty (tiếng Việt)",
  nameEn: "Tên công ty (tiếng Anh)",
  ownership: "Loại hình (trong nước / FDI)",
  field: "Lĩnh vực hoạt động",
  strengths: "Thế mạnh",
  leader: "Lãnh đạo",
  phone: "Điện thoại lãnh đạo",
  leaderEmail: "Email lãnh đạo",
  contactName: "Cán bộ đầu mối",
  contactPhone: "Điện thoại đầu mối",
  contactEmail: "Email đầu mối",
  address: "Địa chỉ",
};

export const EN_LABEL: Record<keyof MemberDirectoryForm, string> = {
  nameVi: "Company name (Vietnamese)",
  nameEn: "Company name (English)",
  ownership: "Ownership (domestic / FDI)",
  field: "Field of activity",
  strengths: "Key strengths",
  leader: "Leader",
  phone: "Leader phone",
  leaderEmail: "Leader email",
  contactName: "Contact person",
  contactPhone: "Contact phone",
  contactEmail: "Contact email",
  address: "Address",
};

const PHONE_KEYS = ["phone", "contactPhone"] as const;
const EMAIL_KEYS = ["leaderEmail", "contactEmail"] as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Trả về key trường đầu tiên còn thiếu hoặc sai định dạng, null khi hợp lệ.
 * SĐT tối thiểu 8 chữ số; email đúng dạng a@b.c.
 */
export function firstMissingDirectoryField(
  form: MemberDirectoryForm,
): keyof MemberDirectoryForm | null {
  const keys = Object.keys(EMPTY_DIRECTORY_FORM) as (keyof MemberDirectoryForm)[];
  for (const key of keys) {
    if (!String(form[key] ?? "").trim()) return key;
  }
  for (const key of PHONE_KEYS) {
    if (form[key].replace(/\D/g, "").length < 8) return key;
  }
  for (const key of EMAIL_KEYS) {
    if (!EMAIL_RE.test(form[key].trim())) return key;
  }
  return null;
}

/** Thông báo lỗi: trường trống -> "bắt buộc", đã nhập -> "sai định dạng". */
export function directoryErrorMessage(
  lang: "vn" | "en",
  key: keyof MemberDirectoryForm,
  form: MemberDirectoryForm,
): string {
  const label = lang === "vn" ? VN_LABEL[key] : EN_LABEL[key];
  if (String(form[key] ?? "").trim()) {
    return lang === "vn"
      ? `"${label}" chưa đúng định dạng.`
      : `"${label}" doesn't look right.`;
  }
  return lang === "vn"
    ? `Vui lòng nhập "${label}" — trường bắt buộc.`
    : `Please fill in "${label}" — required.`;
}

export function isDirectoryFormValid(form: MemberDirectoryForm): boolean {
  return firstMissingDirectoryField(form) === null;
}

/** Map form Danh bạ <-> DtaMember để tái dùng ở admin/portal. */
export function directoryFormToMember(
  form: MemberDirectoryForm,
  base?: Partial<DtaMember>,
): Omit<DtaMember, "id"> & { id?: string } {
  return {
    ...base,
    name: form.nameVi.trim(),
    nameEn: form.nameEn.trim(),
    role: base?.role ?? "Hội viên",
    type: base?.type ?? "organization",
    domain: form.field.trim(),
    ownership: (form.ownership || undefined) as MemberOwnership | undefined,
    leader: form.leader.trim(),
    phone: form.phone.trim(),
    strengths: form.strengths.trim(),
    leaderEmail: form.leaderEmail.trim(),
    contactName: form.contactName.trim(),
    contactPhone: form.contactPhone.trim(),
    contactEmail: form.contactEmail.trim(),
    address: form.address.trim(),
  };
}

export function memberToDirectoryForm(
  m?:
    | (Pick<
        DtaMember,
        "name" | "nameEn" | "ownership" | "leader" | "phone" | "domain" | "strengths"
      > &
        MemberContact)
    | null,
): MemberDirectoryForm {
  if (!m) return { ...EMPTY_DIRECTORY_FORM };
  return {
    nameVi: m.name ?? "",
    nameEn: m.nameEn ?? "",
    ownership: m.ownership ?? "",
    field: m.domain ?? "",
    strengths: m.strengths ?? "",
    leader: m.leader ?? "",
    phone: m.phone ?? "",
    leaderEmail: m.leaderEmail ?? "",
    contactName: m.contactName ?? "",
    contactPhone: m.contactPhone ?? "",
    contactEmail: m.contactEmail ?? "",
    address: m.address ?? "",
  };
}
