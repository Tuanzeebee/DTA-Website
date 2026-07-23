import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Wallet,
  HandCoins,
  BadgeCheck,
  Plus,
  Trash2,
  Bell,
  Check,
} from "lucide-react";
import { allMembers } from "@/data";
import {
  feeStore,
  genId,
  FEE_STATUS_LABEL,
  type FeeRecord,
} from "@/compenents/admin/opsData";
import {
  Field,
  INPUT,
  StatusChip,
  PageHeader,
  PRIMARY_BTN,
  PRIMARY_STYLE,
  GHOST_BTN,
  ICON_BTN,
  TH,
} from "@/compenents/admin/ui";

/** Hội phí & Tài chính: thu/chờ thu/miễn per member-year, mark-paid flow,
 *  reminder mail (simulated until the backend exists). */
export const Route = createFileRoute("/admin/hoi-phi")({
  component: AdminFees,
});

const vnd = (n: number) => `${n.toLocaleString("vi-VN")} ₫`;
const todayVn = () => {
  const d = new Date();
  const p = (x: number) => String(x).padStart(2, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
};

function AdminFees() {
  const records = feeStore.useItems();
  const [showForm, setShowForm] = useState(false);

  const stats = useMemo(() => {
    const paid = records.filter((r) => r.status === "paid");
    const pending = records.filter((r) => r.status === "pending");
    return {
      collected: paid.reduce((s, r) => s + r.amount, 0),
      outstanding: pending.reduce((s, r) => s + r.amount, 0),
      pendingCount: pending.length,
      exemptCount: records.filter((r) => r.status === "exempt").length,
    };
  }, [records]);

  const markPaid = (r: FeeRecord) => {
    feeStore.save({ ...r, status: "paid", paidDate: todayVn() });
    toast.success(`Đã xác nhận ${r.memberName} nộp hội phí ${r.year}.`);
  };

  const remind = (r: FeeRecord) => {
    toast.success(
      `Đã gửi email nhắc hội phí ${r.year} tới ${r.memberName} (mô phỏng — chờ backend).`,
    );
  };

  const remove = (r: FeeRecord) => {
    if (!window.confirm(`Xóa khoản phí của “${r.memberName}” (${r.year})?`))
      return;
    feeStore.remove(r.id);
    toast.success("Đã xóa bản ghi hội phí.");
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="Hội phí & Tài chính"
        desc="Theo dõi hội phí theo hội viên và theo năm. Xác nhận đã nộp, nhắc phí qua email (mô phỏng), hoặc đánh dấu miễn theo điều lệ."
        actions={
          <button
            onClick={() => setShowForm((v) => !v)}
            className={PRIMARY_BTN}
            style={PRIMARY_STYLE}
          >
            <Plus className="w-3.5 h-3.5" />
            Thêm khoản phí
          </button>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={Wallet} label="Đã thu" value={vnd(stats.collected)} />
        <Stat icon={HandCoins} label="Chờ thu" value={vnd(stats.outstanding)} />
        <Stat icon={Bell} label="Hội viên chờ nộp" value={stats.pendingCount} />
        <Stat
          icon={BadgeCheck}
          label="Miễn hội phí"
          value={stats.exemptCount}
        />
      </div>

      {showForm && (
        <FeeForm
          onSave={(r) => {
            feeStore.save(r);
            setShowForm(false);
            toast.success("Đã thêm khoản hội phí.");
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Table */}
      <div className="rounded-2xl border border-white/10 overflow-x-auto">
        <table className="w-full text-xs min-w-[760px]">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03]">
              <th className={TH}>Hội viên</th>
              <th className={TH}>Năm</th>
              <th className={TH}>Mức phí</th>
              <th className={TH}>Trạng thái</th>
              <th className={TH}>Ngày nộp / Ghi chú</th>
              <th className={`${TH} text-right`}>Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {records.map((r) => (
              <tr key={r.id} className="hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-bold text-white/85 max-w-[300px]">
                  <span className="line-clamp-2">{r.memberName}</span>
                </td>
                <td className="px-4 py-3 text-white/60 font-mono">{r.year}</td>
                <td className="px-4 py-3 text-white/80 font-mono whitespace-nowrap">
                  {r.status === "exempt" ? "—" : vnd(r.amount)}
                </td>
                <td className="px-4 py-3">
                  <StatusChip
                    tone={
                      r.status === "paid"
                        ? "green"
                        : r.status === "pending"
                          ? "amber"
                          : "slate"
                    }
                  >
                    {FEE_STATUS_LABEL[r.status]}
                  </StatusChip>
                </td>
                <td className="px-4 py-3 text-white/50 max-w-[220px]">
                  {r.paidDate && (
                    <span className="font-mono">{r.paidDate}</span>
                  )}
                  {r.note && <span className="line-clamp-2">{r.note}</span>}
                  {!r.paidDate && !r.note && "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    {r.status === "pending" && (
                      <>
                        <button
                          onClick={() => markPaid(r)}
                          title="Xác nhận đã nộp"
                          className={`${ICON_BTN} hover:text-emerald-300`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => remind(r)}
                          title="Gửi email nhắc phí"
                          className={`${ICON_BTN} hover:text-accent`}
                        >
                          <Bell className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => remove(r)}
                      title="Xóa bản ghi"
                      className={`${ICON_BTN} hover:text-red-300`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-white/45"
                >
                  Chưa có bản ghi hội phí nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FeeForm({
  onSave,
  onCancel,
}: {
  onSave: (r: FeeRecord) => void;
  onCancel: () => void;
}) {
  const members = allMembers();
  const [memberName, setMemberName] = useState(members[0]?.name.vn ?? "");
  const [year, setYear] = useState(new Date().getFullYear());
  const [amount, setAmount] = useState(10_000_000);
  const [status, setStatus] = useState<FeeRecord["status"]>("pending");

  return (
    <div className="rounded-2xl border border-accent/30 bg-white/[0.02] p-5">
      <div className="grid sm:grid-cols-4 gap-4">
        <Field label="Hội viên">
          <select
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            className={INPUT}
          >
            {members.map((m) => (
              <option key={m.id} value={m.name.vn}>
                {m.name.vn}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Năm">
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className={INPUT}
          />
        </Field>
        <Field label="Mức phí (VND)">
          <input
            type="number"
            step={500_000}
            value={amount}
            onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
            className={INPUT}
          />
        </Field>
        <Field label="Trạng thái">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as FeeRecord["status"])}
            className={INPUT}
          >
            <option value="pending">Chờ nộp</option>
            <option value="paid">Đã nộp</option>
            <option value="exempt">Miễn phí</option>
          </select>
        </Field>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onCancel} className={GHOST_BTN}>
          Hủy
        </button>
        <button
          onClick={() =>
            onSave({
              id: genId("fee"),
              memberName,
              year,
              amount,
              status,
              paidDate: status === "paid" ? todayVn() : undefined,
            })
          }
          className={PRIMARY_BTN}
          style={PRIMARY_STYLE}
        >
          <Plus className="w-3.5 h-3.5" />
          Thêm
        </button>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Wallet;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <Icon className="w-4 h-4 text-accent mb-3" />
      <div className="text-lg font-black text-white leading-none">{value}</div>
      <div className="mt-1.5 text-[10px] uppercase tracking-wider text-white/50 font-bold">
        {label}
      </div>
    </div>
  );
}
