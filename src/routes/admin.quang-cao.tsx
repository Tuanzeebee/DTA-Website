import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Pencil,
  ExternalLink,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import {
  AD_SLOTS,
  adSlotLabel,
  type AdPlacement,
  type AdSlot,
} from "@/compenents/admin/opsData";
import {
  adminFetchAds,
  adminCreateAd,
  adminUpdateAd,
  adminToggleAd,
  adminDeleteAd,
  uploadAdImage,
} from "@/lib/api";
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
import { RequireSection } from "@/compenents/admin/SectionGate";

export const Route = createFileRoute("/admin/quang-cao")({
  component: () => (
    <RequireSection section="ads">
      <AdminAds />
    </RequireSection>
  ),
});

function AdminAds() {
  const [ads, setAds] = useState<AdPlacement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AdPlacement | "new" | null>(null);

  const fetchAds = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminFetchAds();
      setAds(
        data.map((a) => ({
          id: a.id,
          title: a.title,
          slot: a.slot as AdSlot,
          imageUrl: a.imageUrl,
          linkUrl: a.linkUrl,
          active: a.active,
          note: a.note ?? undefined,
        })),
      );
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Lỗi tải danh sách");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  const remove = async (a: AdPlacement) => {
    if (!window.confirm(`Xóa quảng cáo "${a.title}"?`)) return;
    try {
      await adminDeleteAd(a.id);
      setAds((prev) => prev.filter((x) => x.id !== a.id));
      if (editing !== null && editing !== "new" && editing.id === a.id)
        setEditing(null);
      toast.success("Đã xóa quảng cáo.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Lỗi xóa");
    }
  };

  const toggleActive = async (a: AdPlacement) => {
    try {
      const updated = await adminToggleAd(a.id);
      setAds((prev) =>
        prev.map((x) =>
          x.id === a.id
            ? { ...x, active: updated.active }
            : x,
        ),
      );
      toast.success(
        a.active
          ? "Đã tắt — quảng cáo không còn hiện trên trang tin."
          : "Đã bật — quảng cáo đang hiện trên trang tin.",
      );
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Lỗi cập nhật");
    }
  };

  const handleSave = async (data: AdPlacement) => {
    try {
      if (editing === "new") {
        const created = await adminCreateAd({
          title: data.title,
          slot: data.slot,
          imageUrl: data.imageUrl,
          linkUrl: data.linkUrl,
          active: data.active,
          note: data.note,
        });
        setAds((prev) => [
          {
            id: created.id,
            title: created.title,
            slot: created.slot as AdSlot,
            imageUrl: created.imageUrl,
            linkUrl: created.linkUrl,
            active: created.active,
            note: created.note ?? undefined,
          },
          ...prev,
        ]);
        toast.success("Đã thêm quảng cáo.");
      } else {
        const updated = await adminUpdateAd(editing.id, {
          title: data.title,
          slot: data.slot,
          imageUrl: data.imageUrl,
          linkUrl: data.linkUrl,
          active: data.active,
          note: data.note,
        });
        setAds((prev) =>
          prev.map((x) =>
            x.id === editing.id
              ? {
                  id: updated.id,
                  title: updated.title,
                  slot: updated.slot as AdSlot,
                  imageUrl: updated.imageUrl,
                  linkUrl: updated.linkUrl,
                  active: updated.active,
                  note: updated.note ?? undefined,
                }
              : x,
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
      <PageHeader
        title="Quảng cáo & Banner"
        desc="Quản lý banner & quảng cáo hiển thị trên trang tin DTA News. Mỗi quảng cáo gồm một ảnh (tải từ máy hoặc dán URL) và đường dẫn đích khi độc giả bấm vào."
        actions={
          <button
            onClick={() => setEditing("new")}
            className={PRIMARY_BTN}
            style={PRIMARY_STYLE}
          >
            <Plus className="w-3.5 h-3.5" />
            Thêm quảng cáo
          </button>
        }
      />

      {editing !== null && (
        <AdForm
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
          <table className="w-full text-xs min-w-[860px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03]">
                <th className={TH}>Quảng cáo</th>
                <th className={TH}>Vị trí</th>
                <th className={TH}>Link đích</th>
                <th className={TH}>Trạng thái</th>
                <th className={`${TH} text-right`}>Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {ads.map((a) => (
                <tr key={a.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 max-w-[380px]">
                    <div className="flex items-center gap-3">
                      <img
                        src={a.imageUrl}
                        alt=""
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-24 h-12 rounded-lg object-cover border border-white/10 shrink-0 bg-white/5"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-white/85 line-clamp-2">
                          {a.title}
                        </div>
                        {a.note && (
                          <div className="text-[11px] text-white/50 line-clamp-1 mt-0.5">
                            {a.note}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusChip tone="cyan">{adSlotLabel(a.slot)}</StatusChip>
                  </td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <a
                      href={a.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-accent hover:text-cyan-300 transition-colors font-bold"
                    >
                      <ExternalLink className="w-3 h-3 shrink-0" />
                      <span className="truncate">{a.linkUrl}</span>
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <StatusChip tone={a.active ? "green" : "slate"}>
                      {a.active ? "Đang hiện" : "Đã tắt"}
                    </StatusChip>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => toggleActive(a)}
                        title={a.active ? "Tắt quảng cáo" : "Bật quảng cáo"}
                        className={`${ICON_BTN} hover:text-amber-300`}
                      >
                        {a.active ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => setEditing(a)}
                        title="Sửa"
                        className={`${ICON_BTN} hover:text-white`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => remove(a)}
                        title="Xóa"
                        className={`${ICON_BTN} hover:text-red-300`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {ads.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-white/45"
                  >
                    Chưa có quảng cáo nào — bấm "Thêm quảng cáo".
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

function AdForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: AdPlacement;
  onSave: (a: AdPlacement) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slot, setSlot] = useState<AdSlot>(initial?.slot ?? "banner");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [linkUrl, setLinkUrl] = useState(initial?.linkUrl ?? "");
  const [active, setActive] = useState(initial?.active ?? true);
  const [note, setNote] = useState(initial?.note ?? "");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!title.trim() || !imageUrl.trim() || !linkUrl.trim()) {
      toast.error("Cần nhập Tên quảng cáo, Ảnh và Link URL.");
      return;
    }
    setSaving(true);
    try {
      onSave({
        id: initial?.id ?? "",
        title: title.trim(),
        slot,
        imageUrl: imageUrl.trim(),
        linkUrl: linkUrl.trim(),
        active,
        note: note.trim() || undefined,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const url = await uploadAdImage(file);
      setImageUrl(url);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Lỗi upload");
    }
  };

  return (
    <div className="rounded-2xl border border-accent/30 bg-white/[0.02] p-5 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Tên chiến dịch / đơn vị quảng cáo *">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="VD: Enouvo — tài trợ tháng 9…"
            className={INPUT}
          />
        </Field>
        <Field label="Vị trí hiển thị *">
          <select
            value={slot}
            onChange={(e) => setSlot(e.target.value as AdSlot)}
            className={INPUT}
          >
            {AD_SLOTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Ảnh quảng cáo — tải từ máy hoặc dán URL *">
        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="URL ảnh (https://… hoặc /uploads/ads/…)"
          className={INPUT}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }}
          className="mt-2 w-full text-xs text-white/60 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
        />
      </Field>

      <Field label="Link URL đích (mở khi bấm vào ảnh) *">
        <input
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          placeholder="https://…"
          className={INPUT}
        />
      </Field>

      <div className="grid sm:grid-cols-2 gap-4 items-end">
        <Field label="Ghi chú nội bộ">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="VD: chạy đến hết tháng 9…"
            className={INPUT}
          />
        </Field>
        <label className="flex items-center gap-2.5 px-1 pb-1.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="w-4 h-4 accent-cyan-500 cursor-pointer"
          />
          <span className="text-xs text-white/75 font-bold">
            Hiển thị ngay trên trang tin
          </span>
        </label>
      </div>

      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className={GHOST_BTN}>
          Hủy
        </button>
        <button
          onClick={submit}
          disabled={saving}
          className={PRIMARY_BTN}
          style={PRIMARY_STYLE}
        >
          <Plus className="w-3.5 h-3.5" />
          {saving ? "Đang lưu..." : initial ? "Lưu thay đổi" : "Thêm quảng cáo"}
        </button>
      </div>
    </div>
  );
}
