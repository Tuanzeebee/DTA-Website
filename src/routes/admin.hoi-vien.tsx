import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  GripVertical,
  Pencil,
  Trash2,
  UserPlus,
  Loader2,
} from "lucide-react";
import { type DtaMember, pickContact, contactPayload } from "@/data";
import {
  adminFetchMembers,
  adminCreateMember,
  adminUpdateMember,
  adminDeleteMember,
  type MemberItem,
} from "@/lib/api";
import { MemberEditor } from "@/compenents/admin/MemberEditor";
import { RequireSection } from "@/compenents/admin/SectionGate";

export const Route = createFileRoute("/admin/hoi-vien")({
  component: () => (
    <RequireSection section="members">
      <AdminMembers />
    </RequireSection>
  ),
});

const TYPE_LABEL: Record<DtaMember["type"], string> = {
  organization: "Tổ chức",
  individual: "Cá nhân",
  advisory: "Cố vấn",
};

type Row = DtaMember & { sortOrder: number };

function toRow(m: MemberItem): Row {
  return {
    id: m.id,
    name: m.name,
    nameEn: m.nameEn ?? undefined,
    role: m.role,
    type: m.type as DtaMember["type"],
    domain: m.domain,
    ownership:
      m.ownership === "fdi" || m.ownership === "domestic"
        ? m.ownership
        : undefined,
    leader: m.leader ?? undefined,
    phone: m.phone ?? undefined,
    ...pickContact(m),
    strengths: m.strengths ?? undefined,
    logoUrl: m.logoUrl ?? undefined,
    website: m.website ?? undefined,
    sortOrder: m.sortOrder,
  };
}

/** Body gửi API khi tạo/sửa — các trường của form MemberEditor. */
function toPayload(data: DtaMember) {
  return {
    name: data.name,
    nameEn: data.nameEn,
    role: data.role,
    type: data.type,
    domain: data.domain,
    ownership: data.ownership,
    leader: data.leader,
    phone: data.phone,
    ...contactPayload(data),
    strengths: data.strengths,
    logoUrl: data.logoUrl,
    website: data.website,
  };
}

function AdminMembers() {
  const [members, setMembers] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [dragFrom, setDragFrom] = useState<number | null>(null);

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminFetchMembers();
      setMembers(data.map(toRow));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Lỗi tải danh sách");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const remove = async (m: DtaMember) => {
    if (!window.confirm(`Xóa hội viên "${m.name}"?`)) return;
    try {
      await adminDeleteMember(m.id);
      setMembers((prev) => prev.filter((x) => x.id !== m.id));
      if (editing !== null && editing !== "new" && editing.id === m.id)
        setEditing(null);
      toast.success("Đã xóa hội viên.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Lỗi xóa");
    }
  };

  /** Chuyển hội viên từ vị trí `from` sang `to`, đánh số lại 0..n-1 (dữ liệu
   * cũ phần lớn sortOrder = 0 nên không hoán đổi được) và chỉ PATCH dòng đổi số. */
  const move = async (from: number, to: number) => {
    if (from === to || to < 0 || to >= members.length) return;
    const next = [...members];
    next.splice(to, 0, ...next.splice(from, 1));
    const renumbered = next.map((m, i) => ({ ...m, sortOrder: i }));
    const changed = renumbered.filter(
      (m) => members.find((x) => x.id === m.id)?.sortOrder !== m.sortOrder,
    );
    setMembers(renumbered);
    try {
      await Promise.all(
        changed.map((m) => adminUpdateMember(m.id, { sortOrder: m.sortOrder })),
      );
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Lỗi lưu thứ tự");
      fetchMembers();
    }
  };

  useEffect(() => {
    if (editing === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setEditing(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editing]);

  const handleSave = async (data: DtaMember) => {
    if (editing === null) return;
    try {
      if (editing === "new") {
        const created = await adminCreateMember({
          ...toPayload(data),
          // Hội viên mới xếp cuối danh sách.
          sortOrder: Math.max(-1, ...members.map((m) => m.sortOrder)) + 1,
        });
        setMembers((prev) => [...prev, toRow(created)]);
        toast.success("Đã thêm hội viên.");
      } else {
        const updated = await adminUpdateMember(editing.id, toPayload(data));
        setMembers((prev) =>
          prev.map((m) => (m.id === editing.id ? toRow(updated) : m)),
        );
        toast.success("Đã lưu thay đổi.");
      }
      setEditing(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Lỗi lưu");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-wrap items-center gap-3">
        <div className="mr-auto">
          <h1 className="text-xl font-black text-white">Hội viên</h1>
          <p className="mt-1 text-xs text-white/50 max-w-2xl">
            Quản lý danh sách hội viên. Dữ liệu được lưu trên backend và hiển
            thị trên trang chủ.
          </p>
        </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setEditing(null)}
          />
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#101a18]">
            <MemberEditor
              key={editing === "new" ? "new" : editing.id}
              initial={editing === "new" ? undefined : editing}
              onSave={handleSave}
              onCancel={() => setEditing(null)}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-white/40 gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-xs">Đang tải danh sách...</span>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[860px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03] text-[10px] uppercase tracking-wider text-white/50">
                <th className="px-2 py-3 font-bold w-0">Thứ tự</th>
                <th className="px-4 py-3 font-bold">Hội viên</th>
                <th className="px-4 py-3 font-bold">Loại hình</th>
                <th className="px-4 py-3 font-bold">Lĩnh vực</th>
                <th className="px-4 py-3 font-bold">Liên hệ</th>
                <th className="px-4 py-3 font-bold">Website</th>
                <th className="px-4 py-3 font-bold text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {members.map((m, i) => (
                <tr
                  key={m.id}
                  draggable
                  onDragStart={() => setDragFrom(i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (dragFrom !== null) move(dragFrom, i);
                    setDragFrom(null);
                  }}
                  onDragEnd={() => setDragFrom(null)}
                  className={`hover:bg-white/[0.02] ${dragFrom === i ? "opacity-40" : ""}`}
                >
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-1 text-white/40">
                      <GripVertical
                        className="w-4 h-4 cursor-grab"
                        aria-label="Kéo để sắp xếp"
                      />
                      <span className="w-5 text-center tabular-nums">
                        {i + 1}
                      </span>
                      <div className="flex flex-col">
                        <button
                          onClick={() => move(i, i - 1)}
                          disabled={i === 0}
                          title="Lên trên"
                          className="p-0.5 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-default"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => move(i, i + 1)}
                          disabled={i === members.length - 1}
                          title="Xuống dưới"
                          className="p-0.5 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-default"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </td>
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
                            {m.name
                              .split(/\s+/)
                              .slice(0, 2)
                              .map((w) => w[0])
                              .join("")
                              .toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 max-w-[280px]">
                        <div className="font-bold text-white/90 truncate">
                          {m.name}
                        </div>
                        {m.nameEn && (
                          <div className="text-[10px] text-white/40 truncate">
                            {m.nameEn}
                          </div>
                        )}
                        <div className="text-[10px] text-white/40">
                          {m.role} · {TYPE_LABEL[m.type]}
                          {m.leader ? ` · ${m.leader}` : ""}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/70 whitespace-nowrap">
                    {m.ownership === "fdi"
                      ? "FDI"
                      : m.ownership === "domestic"
                        ? "Trong nước"
                        : "—"}
                  </td>
                  <td className="px-4 py-3 text-white/60 max-w-[260px]">
                    <span className="line-clamp-2">{m.domain}</span>
                    {m.strengths && (
                      <span className="block text-[10px] text-white/40 line-clamp-1 mt-0.5">
                        {m.strengths}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-white/60 whitespace-nowrap">
                    {m.phone ?? <span className="text-white/30">—</span>}
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
                    colSpan={7}
                    className="px-4 py-10 text-center text-white/45"
                  >
                    Danh sách trống — bấm "Thêm hội viên".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
