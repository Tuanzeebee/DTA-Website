import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ExternalLink,
  Pencil,
  Trash2,
  UserPlus,
  Loader2,
} from "lucide-react";
import type { DtaMember } from "@/data";
import {
  adminFetchMembers,
  adminCreateMember,
  adminUpdateMember,
  adminDeleteMember,
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

function AdminMembers() {
  const [members, setMembers] = useState<DtaMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<DtaMember | "new" | null>(null);

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminFetchMembers();
      setMembers(
        data.map((m) => ({
          id: m.id,
          name: m.name,
          role: m.role,
          type: m.type as DtaMember["type"],
          domain: m.domain,
          logoUrl: m.logoUrl ?? undefined,
          website: m.website ?? undefined,
        })),
      );
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

  const handleSave = async (data: DtaMember) => {
    try {
      if (editing === "new") {
        const created = await adminCreateMember({
          name: data.name,
          role: data.role,
          type: data.type,
          domain: data.domain,
          logoUrl: data.logoUrl,
          website: data.website,
        });
        setMembers((prev) => [
          {
            id: created.id,
            name: created.name,
            role: created.role,
            type: created.type as DtaMember["type"],
            domain: created.domain,
            logoUrl: created.logoUrl ?? undefined,
            website: created.website ?? undefined,
          },
          ...prev,
        ]);
        toast.success("Đã thêm hội viên.");
      } else {
        const updated = await adminUpdateMember(editing.id, {
          name: data.name,
          role: data.role,
          type: data.type,
          domain: data.domain,
          logoUrl: data.logoUrl,
          website: data.website,
        });
        setMembers((prev) =>
          prev.map((m) =>
            m.id === editing.id
              ? {
                  id: updated.id,
                  name: updated.name,
                  role: updated.role,
                  type: updated.type as DtaMember["type"],
                  domain: updated.domain,
                  logoUrl: updated.logoUrl ?? undefined,
                  website: updated.website ?? undefined,
                }
              : m,
          ),
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
        <MemberEditor
          key={editing === "new" ? "new" : editing.id}
          initial={editing === "new" ? undefined : editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-white/40 gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-xs">Đang tải danh sách...</span>
        </div>
      ) : (
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
                        <div className="text-[10px] text-white/40">
                          {m.role}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/70 whitespace-nowrap">
                    {TYPE_LABEL[m.type]}
                  </td>
                  <td className="px-4 py-3 text-white/60 max-w-[260px]">
                    <span className="line-clamp-2">{m.domain}</span>
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
