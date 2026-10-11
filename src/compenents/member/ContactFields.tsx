import type { MemberContactKey } from "@/data";
import { EN_LABEL, VN_LABEL } from "@/lib/memberDirectory";
import type { Lang } from "@/types";

const FIELDS: {
  key: MemberContactKey;
  type: string;
  placeholder: string;
  wide?: boolean;
}[] = [
  { key: "leaderEmail", type: "email", placeholder: "e.g. giamdoc@congty.vn" },
  { key: "contactName", type: "text", placeholder: "e.g. Nguyễn Thị Lan" },
  { key: "contactPhone", type: "tel", placeholder: "e.g. 0905 xxx xxx" },
  { key: "contactEmail", type: "email", placeholder: "e.g. lienhe@congty.vn" },
  {
    key: "address",
    type: "text",
    placeholder: "e.g. 15 Quang Trung, Hải Châu, Đà Nẵng",
    wide: true,
  },
];

/**
 * 5 trường thẻ Danh bạ bổ sung (email lãnh đạo, cán bộ đầu mối + SĐT + email,
 * địa chỉ) — dùng chung cho form đăng ký, hồ sơ hội viên và admin.
 * Đặt trong một grid sm:grid-cols-2 của form cha.
 */
export function ContactFields({
  lang,
  value,
  onChange,
  inputClass,
  labelClass,
  required = false,
  hints = {},
}: {
  lang: Lang;
  value: Partial<Record<MemberContactKey, string | undefined>>;
  onChange: (key: MemberContactKey, v: string) => void;
  inputClass: string;
  labelClass: string;
  required?: boolean;
  hints?: Partial<Record<MemberContactKey, string>>;
}) {
  return (
    <>
      {FIELDS.map((f) => (
        <div key={f.key} className={f.wide ? "sm:col-span-2" : undefined}>
          <label className={labelClass}>
            {(lang === "vn" ? VN_LABEL : EN_LABEL)[f.key]}
            {required ? " *" : ""}
          </label>
          <input
            type={f.type}
            value={value[f.key] ?? ""}
            onChange={(e) => onChange(f.key, e.target.value)}
            placeholder={f.placeholder}
            className={inputClass}
          />
          {hints[f.key] && (
            <p className="text-[11px] text-muted-foreground mt-1">
              {hints[f.key]}
            </p>
          )}
        </div>
      ))}
    </>
  );
}
