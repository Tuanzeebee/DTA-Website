import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Check,
  XCircle,
  Trash2,
  Mail,
  Phone,
  Building,
  User,
  Inbox,
} from "lucide-react";
import {
  applicationStore,
  APPLICATION_STATUS_LABEL,
  type MemberApplication,
} from "@/compenents/admin/opsData";
import { saveMember, newMemberId } from "@/compenents/admin/memberStore";
import { StatusChip, PageHeader, ICON_BTN } from "@/compenents/admin/ui";

/**
 * Đăng ký hội viên mới: hộp đơn chờ (nguồn thật sẽ là form Gia nhập trên
 * portal khi có backend). Duyệt = thêm thẳng vào danh bạ hội viên (hiện
 * trên toàn trang) + email chúc mừng; từ chối = email phản hồi. Email đang
 * mô phỏng bằng toast cho tới khi có máy chủ gửi mail.
 */
export const Route = createFileRoute("/admin/dang-ky")({
  component: AdminApplications,
});

type Tab = "pending" | "approved" | "rejected" | "all";

const TABS: { value: Tab; label: string }[] = [
  { value: "pending", label: "Chờ duyệt" },
  { value: "approved", label: "Đã duyệt" },
  { value: "rejected", label: "Từ chối" },
  { value: "all", label: "Tất cả" },
];

function AdminApplications() {
  const apps = applicationStore.useItems();
  const [tab, setTab] = useState<Tab>("pending");

  const rows = useMemo(
    () => (tab === "all" ? apps : apps.filter((a) => a.status === tab)),
    [apps, tab],
  );
  const pendingCount = apps.filter((a) => a.status === "pending").length;

  const approve = (a: MemberApplication) => {
    applicationStore.save({ ...a, status: "approved" });
    // Straight into the member directory — logos/marquee update site-wide.
    saveMember({
      id: newMemberId(),
      name: { vn: a.orgName, en: a.orgName },
      role: {
        vn:
          a.type === "organization"
            ? "Hội viên Tổ chức · Kết nạp mới"
            : "Hội viên Cá nhân · Kết nạp mới",
        en:
          a.type === "organization"
            ? "Corporate Member · Newly admitted"
            : "Individual Member · Newly admitted",
      },
      type: a.type,
      domain: { vn: a.domain ?? "", en: a.domain ?? "" },
      logoInitials:
        a.orgName
          .split(/\s+/)
          .slice(-3)
          .map((w) => w[0])
          .join("")
          .toUpperCase() || "DTA",
    });
    toast.success(
      `Đã kết nạp “${a.orgName}” và gửi email chúc mừng tới ${a.email} (mô phỏng).`,
    );
  };

  const reject = (a: MemberApplication) => {
    applicationStore.save({ ...a, status: "rejected" });
    toast.success(
      `Đã từ chối hồ sơ và gửi email phản hồi tới ${a.email} (mô phỏng).`,
    );
  };

  const remove = (a: MemberApplication) => {
    if (!window.confirm(`Xóa hồ sơ của “${a.orgName}”?`)) return;
    applicationStore.remove(a.id);
    toast.success("Đã xóa hồ sơ.");
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Đăng ký hội viên mới"
        desc="Hồ sơ gửi từ portal Gia nhập DTA. Duyệt sẽ thêm ngay vào danh bạ hội viên (logo hiện trên toàn trang) và thông báo qua email; từ chối cũng phản hồi qua email."
      />

      {/* Status tabs */}
      <div className="flex rounded-full border border-white/10 bg-white/[0.03] p-0.5 w-fit">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
              tab === t.value
                ? "bg-accent/15 text-accent"
                : "text-white/55 hover:text-white"
            }`}
          >
            {t.label}
            {t.value === "pending" && pendingCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-black">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {rows.map((a) => (
          <div
            key={a.id}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
          >
            <div className="flex flex-wrap items-start gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <StatusChip
                    tone={
                      a.status === "approved"
                        ? "green"
                        : a.status === "pending"
                          ? "amber"
                          : "red"
                    }
                  >
                    {APPLICATION_STATUS_LABEL[a.status]}
                  </StatusChip>
                  <StatusChip tone="slate">
                    {a.type === "organization" ? "Tổ chức" : "Cá nhân"}
                  </StatusChip>
                  <span className="text-[10px] text-white/40 font-mono">
                    {a.date}
                  </span>
                </div>

                <h3 className="flex items-center gap-2 font-bold text-sm text-white/90">
                  {a.type === "organization" ? (
                    <Building className="w-3.5 h-3.5 text-accent shrink-0" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-accent shrink-0" />
                  )}
                  {a.orgName}
                </h3>
                {a.domain && (
                  <p className="mt-1 text-[11px] text-white/55">{a.domain}</p>
                )}

                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-white/60">
                  <span className="font-medium text-white/75">
                    {a.contactName}
                  </span>
                  <a
                    href={`mailto:${a.email}`}
                    className="inline-flex items-center gap-1 hover:text-cyan-300 transition-colors"
                  >
                    <Mail className="w-3 h-3" />
                    {a.email}
                  </a>
                  {a.phone && (
                    <span className="inline-flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {a.phone}
                    </span>
                  )}
                </div>

                {a.message && (
                  <p className="mt-2.5 text-[11px] text-white/50 leading-relaxed border-l-2 border-white/10 pl-3">
                    {a.message}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {a.status === "pending" && (
                  <>
                    <button
                      onClick={() => approve(a)}
                      title="Duyệt & kết nạp — gửi email thông báo"
                      className={`${ICON_BTN} hover:text-emerald-300`}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => reject(a)}
                      title="Từ chối (gửi email phản hồi)"
                      className={`${ICON_BTN} hover:text-amber-300`}
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => remove(a)}
                  title="Xóa hồ sơ"
                  className={`${ICON_BTN} hover:text-red-300`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-xs text-white/45">
            <Inbox className="w-6 h-6 mx-auto mb-3 text-white/25" />
            Không có hồ sơ nào ở trạng thái này.
          </div>
        )}
      </div>
    </div>
  );
}
