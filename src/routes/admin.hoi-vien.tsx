import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  ExternalLink,
  Pencil,
  Trash2,
  UserPlus,
  RotateCcw,
} from "lucide-react";
import type { DtaMember } from "@/data";
import {
  useAdminMembers,
  saveMember,
  deleteMember,
  memberOrigin,
  resetMembersToMockData,
} from "@/compenents/admin/memberStore";
import { MemberEditor } from "@/compenents/admin/MemberEditor";

/**
 * Member management: full CRUD over the localStorage overlay — changes are
 * live everywhere membership renders (landing marquee, portal logo grids,
 * community page). The self-service flow from the association's plan
 * (member accounts + editorial approval) still needs the real backend.
 */
export const Route = createFileRoute("/admin/hoi-vien")({
  component: AdminMembers,
});

const TYPE_LABEL: Record<DtaMember["type"], string> = {
  organization: "Tổ chức",
  individual: "Cá nhân",
  advisory: "Cố vấn",
};

function AdminMembers() {
  const members = useAdminMembers();
  /** null = closed, "new" = adding, otherwise the member being edited. */
  const [editing, setEditing] = useState<DtaMember | "new" | null>(null);

  const remove = (m: DtaMember) => {
    if (!window.confirm(`Xóa hội viên “${m.name.vn}”?`)) return;
    deleteMember(m.id);
    if (editing !== null && editing !== "new" && editing.id === m.id) {
      setEditing(null);
    }
    toast.success("Đã xóa hội viên.");
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-wrap items-center gap-3">
        <div className="mr-auto">
          <h1 className="text-xl font-black text-white">Hội viên</h1>
          <p className="mt-1 text-xs text-white/50 max-w-2xl">
            Thay đổi hiển thị ngay trên trang chủ và trang tin. Hội viên tự cập
            nhật qua tài khoản riêng sẽ kích hoạt khi có backend.
          </p>
        </div>
        <button
          onClick={() => {
            if (
              window.confirm(
                "Xóa toàn bộ thay đổi hội viên trên trình duyệt này và trở về dữ liệu mẫu?",
              )
            ) {
              resetMembersToMockData();
              setEditing(null);
              toast.success("Đã khôi phục danh sách hội viên mẫu.");
            }
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-[11px] font-bold text-white/60 hover:text-white transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Khôi phục dữ liệu mẫu
        </button>
        <button
          onClick={() => setEditing("new")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold text-primary-foreground hover:opacity-90 transition-all cursor-pointer"
          style={{
            background: "var(--gradient-primary)",
            boxShadow: "var(--shadow-glow)",
          }}
        >
          <UserPlus className="w-3.5 h-3.5" />
          Thêm hội viên
        </button>
      </div>

      {editing !== null && (
        <MemberEditor
          key={editing === "new" ? "new" : editing.id}
          initial={editing === "new" ? undefined : editing}
          onSave={(m) => {
            saveMember(m);
            setEditing(null);
            toast.success(
              editing === "new"
                ? "Đã thêm hội viên — logo xuất hiện trên toàn trang."
                : "Đã lưu thay đổi hội viên.",
            );
          }}
          onCancel={() => setEditing(null)}
        />
      )}

      <div className="rounded-2xl border border-white/10 overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[720px]">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03] text-[10px] uppercase tracking-wider text-white/50">
              <th className="px-4 py-3 font-bold">Hội viên</th>
              <th className="px-4 py-3 font-bold">Loại</th>
              <th className="px-4 py-3 font-bold">Lĩnh vực</th>
              <th className="px-4 py-3 font-bold">Website</th>
              <th className="px-4 py-3 font-bold text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/90 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                      {m.logoUrl ? (
                        <img
                          src={m.logoUrl}
                          alt=""
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="max-h-full max-w-full object-contain p-1"
                        />
                      ) : (
                        <span className="text-[10px] font-black text-slate-700">
                          {m.logoInitials}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 max-w-[280px]">
                      <div className="font-bold text-white/90 truncate">
                        {m.name.vn}
                      </div>
                      <div className="text-[10px] text-white/40 font-mono">
                        {m.logoInitials} ·{" "}
                        {memberOrigin(m.id) === "mock"
                          ? "dữ liệu mẫu"
                          : "admin"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-white/70 whitespace-nowrap">
                  {TYPE_LABEL[m.type]}
                </td>
                <td className="px-4 py-3 text-white/60 max-w-[260px]">
                  <span className="line-clamp-2">{m.domain.vn}</span>
                </td>
                <td className="px-4 py-3">
                  {m.website ? (
                    <a
                      href={m.website}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1 text-accent hover:text-cyan-300 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {m.website.replace(/^https?:\/\//, "")}
                    </a>
                  ) : (
                    <span className="text-white/30">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => setEditing(m)}
                      title="Sửa hội viên"
                      className="p-1.5 rounded-lg border border-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => remove(m)}
                      title="Xóa hội viên"
                      className="p-1.5 rounded-lg border border-white/10 text-white/50 hover:text-red-300 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-white/45"
                >
                  Danh sách trống — bấm “Thêm hội viên”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
