import type { DtaMember, MemberOwnership } from "@/data";

/**
 * Mẫu nhập liệu Danh bạ hội viên — dùng chung cho:
 * - portal/dang-ky Step 1 (người mới nộp đơn)
 * - portal ProfilePanel "Chúng tôi nói về mình" (hội viên tự cập nhật)
 * - admin MemberEditor (quản trị nhập hộ / sửa)
 *
 * Theo chốt với Hiệp hội: tất cả 7 trường đều bắt buộc.
 */

export interface MemberDirectoryForm {
  /** Tên công ty tiếng Việt (= DtaMember.name). */
  nameVi: string;
  /** Tên công ty tiếng Anh (= DtaMember.nameEn). */
  nameEn: string;
  /** Loại hình: trong nước hay FDI. */
  ownership: MemberOwnership | "";
  /** Lãnh đạo / người đại diện. */
  leader: string;
  /** Điện thoại liên hệ. */
  phone: string;
  /** Lĩnh vực hoạt động (= DtaMember.domain). */
  field: string;
  /** Thế mạnh / năng lực nổi bật. */
  strengths: string;
}

export const EMPTY_DIRECTORY_FORM: MemberDirectoryForm = {
  nameVi: "",
  nameEn: "",
  ownership: "",
  leader: "",
  phone: "",
  field: "",
  strengths: "",
};

const VN_LABEL: Record<keyof MemberDirectoryForm, string> = {
  nameVi: "Tên công ty (tiếng Việt)",
  nameEn: "Tên công ty (tiếng Anh)",
  ownership: "Loại hình (trong nước / FDI)",
  leader: "Lãnh đạo",
  phone: "Điện thoại",
  field: "Lĩnh vực hoạt động",
  strengths: "Thế mạnh",
};

const EN_LABEL: Record<keyof MemberDirectoryForm, string> = {
  nameVi: "Company name (Vietnamese)",
  nameEn: "Company name (English)",
  ownership: "Ownership (domestic / FDI)",
  leader: "Leader",
  phone: "Phone",
  field: "Field of activity",
  strengths: "Key strengths",
};

/** Trả về key trường còn thiếu đầu tiên, hoặc null khi đã đủ. */
export function firstMissingDirectoryField(
  form: MemberDirectoryForm,
): keyof MemberDirectoryForm | null {
  const keys = Object.keys(form) as (keyof MemberDirectoryForm)[];
  for (const key of keys) {
    if (!String(form[key] ?? "").trim()) return key;
  }
  // SĐT tối thiểu 8 chữ số.
  if ((form.phone.replace(/\D/g, "").length ?? 0) < 8) return "phone";
  return null;
}

export function directoryErrorMessage(
  lang: "vn" | "en",
  key: keyof MemberDirectoryForm,
  phoneTooShort = false,
): string {
  if (key === "phone" && phoneTooShort) {
    return lang === "vn"
      ? "Số điện thoại chưa đúng (cần ít nhất 8 chữ số)."
      : "That phone number looks too short (at least 8 digits).";
  }
  return lang === "vn"
    ? `Vui lòng nhập "${VN_LABEL[key]}" — trường bắt buộc.`
    : `Please fill in "${EN_LABEL[key]}" — required.`;
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
  };
}

export function memberToDirectoryForm(
  m?: Pick<
    DtaMember,
    "name" | "nameEn" | "ownership" | "leader" | "phone" | "domain" | "strengths"
  > | null,
): MemberDirectoryForm {
  if (!m) return { ...EMPTY_DIRECTORY_FORM };
  return {
    nameVi: m.name ?? "",
    nameEn: m.nameEn ?? "",
    ownership: m.ownership ?? "",
    leader: m.leader ?? "",
    phone: m.phone ?? "",
    field: m.domain ?? "",
    strengths: m.strengths ?? "",
  };
}
