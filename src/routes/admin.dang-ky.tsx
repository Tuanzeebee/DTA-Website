import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Check,
  XCircle,
  Mail,
  Phone,
  Building,
  User,
  Inbox,
  Loader2,
  FileText,
  KeyRound,
  Copy,
  X,
} from "lucide-react";
import {
  adminFetchApplications,
  adminApproveApplication,
  adminRejectApplication,
  adminResetMemberPassword,
  type ApplicationItem,
  type ApplicationStatus,
} from "@/lib/api";
import { StatusChip, PageHeader, ICON_BTN } from "@/compenents/admin/ui";
import { RequireSection } from "@/compenents/admin/SectionGate";

/**
 * Đăng ký hội viên mới: đơn chờ duyệt gửi từ form Gia nhập (/portal/dang-ky).
 * Duyệt = tạo Member trong Danh bạ + (Đợt 3) cấp tài khoản MEMBER;
 * từ chối = đổi trạng thái. Nguồn sự thật là backend, không còn localStorage.
 */
export const Route = createFileRoute("/admin/dang-ky")({
  component: () => (
    <RequireSection section="applications">
      <AdminApplications />
    </RequireSection>
  ),
});

type Tab = "PENDING" | "APPROVED" | "REJECTED" | "ALL";

const TABS: { value: Tab; label: string }[] = [
  { value: "PENDING", label: "Chờ duyệt" },
  { value: "APPROVED", label: "Đã duyệt" },
  { value: "REJECTED", label: "Từ chối" },
  { value: "ALL", label: "Tất cả" },
];

const STATUS_TONE: Record<ApplicationStatus, "green" | "amber" | "red"> = {
  APPROVED: "green",
  PENDING: "amber",
  REJECTED: "red",
};

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
};

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("vi-VN");
  } catch {
    return iso;
  }
}

function AdminApplications() {
  const [apps, setApps] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("PENDING");
  const [busyId, setBusyId] = useState<string | null>(null);
  /** Credentials vừa cấp — chỉ hiện 1 lần, đóng là mất. */
  const [creds, setCreds] = useState<{
    orgName: string;
    email: string;
    tempPassword: string;
    isReset: boolean;
  } | null>(null);

  const fetchApps = useCallback(async () => {
    try {
      setLoading(true);
      setApps(await adminFetchApplications());
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Lỗi tải danh sách");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const rows = useMemo(
    () => (tab === "ALL" ? apps : apps.filter((a) => a.status === tab)),
    [apps, tab],
  );
  const pendingCount = apps.filter((a) => a.status === "PENDING").length;

  const approve = async (a: ApplicationItem) => {
    setBusyId(a.id);
    try {
      const result = await adminApproveApplication(a.id);
      setApps((prev) =>
        prev.map((x) => (x.id === a.id ? result.application : x)),
      );
      setCreds({
        orgName: a.orgName,
        email: a.email,
        tempPassword: result.tempPassword,
        isReset: false,
      });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Lỗi duyệt hồ sơ");
    } finally {
      setBusyId(null);
    }
  };

  const resetPassword = async (a: ApplicationItem) => {
    if (
      !window.confirm(
        `Cấp lại mật khẩu cho tài khoản "${a.email}"? Mật khẩu cũ mất hiệu lực ngay.`,
      )
    )
      return;
    setBusyId(a.id);
    try {
      const result = await adminResetMemberPassword(a.id);
      setCreds({
        orgName: a.orgName,
        email: result.email,
        tempPassword: result.tempPassword,
        isReset: true,
      });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Lỗi cấp lại mật khẩu");
    } finally {
      setBusyId(null);
    }
  };

  const copyCreds = async () => {
    if (!creds) return;
    try {
      await navigator.clipboard.writeText(
        `DTA - Tai khoan Không gian số\nEmail: ${creds.email}\nMat khau: ${creds.tempPassword}\nDang nhap tai /dang-nhap va doi mat khau ngay.`,
      );
      toast.success("Đã copy tài khoản.");
    } catch {
      toast.error("Không copy được — ghi tay lại mật khẩu.");
    }
  };

  const reject = async (a: ApplicationItem) => {
    setBusyId(a.id);
    try {
      const updated = await adminRejectApplication(a.id);
      setApps((prev) => prev.map((x) => (x.id === a.id ? updated : x)));
      toast.success(`Đã từ chối hồ sơ "${a.orgName}".`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Lỗi từ chối hồ sơ");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Đăng ký hội viên mới"
        desc="Hồ sơ gửi từ form Gia nhập DTA (kèm công văn + hồ sơ pháp lý). Duyệt sẽ tạo ngay hội viên trong Danh bạ; đơn đã duyệt/từ chối được lưu vết, không xóa."
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
            {t.value === "PENDING" && pendingCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-black">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-white/40 gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-xs">Đang tải danh sách...</span>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((a) => (
            <div
              key={a.id}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
            >
              <div className="flex flex-wrap items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <StatusChip tone={STATUS_TONE[a.status]}>
                      {STATUS_LABEL[a.status]}
                    </StatusChip>
                    <StatusChip tone="slate">
                      {a.type === "organization" ? "Tổ chức" : "Cá nhân"}
                    </StatusChip>
                    <span className="text-[10px] text-white/40 font-mono">
                      {a.trackingCode} · {fmtDate(a.createdAt)}
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
                  {a.nameEn && (
                    <p className="mt-0.5 text-[11px] text-white/40">{a.nameEn}</p>
                  )}
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-white/55">
                    {a.ownership && (
                      <span>
                        {a.ownership === "fdi" ? "FDI" : "Trong nước"}
                      </span>
                    )}
                    {a.leader && <span>Lãnh đạo: {a.leader}</span>}
                    {a.domain && <span>Lĩnh vực: {a.domain}</span>}
                    {a.strengths && <span>Thế mạnh: {a.strengths}</span>}
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
                    {a.consentDocUrl && (
                      <a
                        href={a.consentDocUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1 text-accent hover:text-cyan-300 transition-colors"
                      >
                        <FileText className="w-3 h-3" />
                        Công văn đồng ý
                      </a>
                    )}
                    {a.legalDocUrl && (
                      <a
                        href={a.legalDocUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1 text-accent hover:text-cyan-300 transition-colors"
                      >
                        <FileText className="w-3 h-3" />
                        GPKD / Quyết định thành lập
                      </a>
                    )}
                    {a.techField && (
                      <span className="text-white/55">
                        Lĩnh vực CN: {a.techField}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-white/60">
                    {a.contactName && (
                      <span className="font-medium text-white/75">
                        {a.contactName}
                      </span>
                    )}
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
                  {busyId === a.id ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white/40" />
                  ) : (
                    <>
                      {a.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => approve(a)}
                            title="Duyệt & kết nạp — tạo hội viên + cấp tài khoản"
                            className={`${ICON_BTN} hover:text-emerald-300`}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => reject(a)}
                            title="Từ chối hồ sơ"
                            className={`${ICON_BTN} hover:text-amber-300`}
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {a.status === "APPROVED" && a.createdMemberId && (
                        <button
                          onClick={() => resetPassword(a)}
                          title="Cấp lại mật khẩu hội viên"
                          className={`${ICON_BTN} hover:text-cyan-300`}
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}
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
      )}

      {/* Modal credentials — chỉ hiện 1 lần, đóng là mất, không lưu ở đâu. */}
      {creds && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setCreds(null)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-accent/30 bg-[#101a18] p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
                <KeyRound className="w-4 h-4 text-emerald-400" />
              </span>
              <div className="mr-auto">
                <h3 className="text-sm font-black text-white">
                  {creds.isReset ? "Đã cấp lại mật khẩu" : "Đã kết nạp hội viên"}
                </h3>
                <p className="text-[11px] text-white/50">{creds.orgName}</p>
              </div>
              <button
                onClick={() => setCreds(null)}
                aria-label="Đóng"
                className="p-1.5 rounded-lg text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.07] p-4 space-y-2 text-xs">
              <div className="flex justify-between gap-3">
                <span className="text-white/50">Email đăng nhập</span>
                <span className="font-mono font-bold text-white">
                  {creds.email}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-white/50">Mật khẩu tạm</span>
                <span className="font-mono font-black text-amber-300">
                  {creds.tempPassword}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-amber-300/90 leading-relaxed">
              Mật khẩu chỉ hiện 1 lần duy nhất — copy ngay và gửi cho hội viên
              (hội viên đăng nhập tại /dang-nhap rồi đổi mật khẩu). Đóng bảng
              này là không xem lại được.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setCreds(null)}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs font-bold text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                Đã lưu xong
              </button>
              <button
                onClick={copyCreds}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-primary-foreground hover:opacity-90 transition-all cursor-pointer"
                style={{
                  background: "var(--gradient-primary)",
                  boxShadow: "var(--shadow-glow)",
                }}
              >
                <Copy className="w-3.5 h-3.5" />
                Copy tài khoản
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
