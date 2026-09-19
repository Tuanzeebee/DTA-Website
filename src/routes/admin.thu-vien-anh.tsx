import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Pencil,
  Eye,
  EyeOff,
  Loader2,
  Upload,
} from "lucide-react";
import {
  adminFetchGallery,
  adminCreateGalleryPhoto,
  adminUpdateGalleryPhoto,
  adminToggleGalleryPhoto,
  adminDeleteGalleryPhoto,
  uploadGalleryImage,
  type GalleryPhotoItem,
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
} from "@/compenents/admin/ui";
import { RequireSection } from "@/compenents/admin/SectionGate";

export const Route = createFileRoute("/admin/thu-vien-anh")({
  component: () => (
    <RequireSection section="gallery">
      <AdminGallery />
    </RequireSection>
  ),
});

function AdminGallery() {
  const [photos, setPhotos] = useState<GalleryPhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<GalleryPhotoItem | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchPhotos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminFetchGallery();
      setPhotos(data);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Lỗi tải danh sách");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const baseOrder =
      photos.length > 0 ? Math.max(...photos.map((p) => p.sortOrder)) + 1 : 0;
    let done = 0;
    try {
      for (let i = 0; i < files.length; i++) {
        const url = await uploadGalleryImage(files[i]);
        const created = await adminCreateGalleryPhoto({
          imageUrl: url,
          sortOrder: baseOrder + i,
        });
        setPhotos((prev) => [...prev, created]);
        done++;
      }
      toast.success(`Đã tải lên ${done} ảnh vào thư viện.`);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error
          ? err.message
          : `Đã tải ${done} ảnh, có lỗi xảy ra.`,
      );
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const remove = async (p: GalleryPhotoItem) => {
    if (!window.confirm("Xóa ảnh này khỏi thư viện?")) return;
    try {
      await adminDeleteGalleryPhoto(p.id);
      setPhotos((prev) => prev.filter((x) => x.id !== p.id));
      if (editing?.id === p.id) setEditing(null);
      toast.success("Đã xóa ảnh.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Lỗi xóa");
    }
  };

  const toggleActive = async (p: GalleryPhotoItem) => {
    try {
      const updated = await adminToggleGalleryPhoto(p.id);
      setPhotos((prev) =>
        prev.map((x) => (x.id === p.id ? { ...x, active: updated.active } : x)),
      );
      toast.success(
        p.active
          ? "Đã ẩn — ảnh không còn hiện ngoài trang chủ."
          : "Đã hiện — ảnh đang hiển thị ngoài trang chủ.",
      );
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Lỗi cập nhật");
    }
  };

  const handleSave = async (caption: string, sortOrder: number) => {
    if (!editing) return;
    try {
      const updated = await adminUpdateGalleryPhoto(editing.id, {
        caption,
        sortOrder,
      });
      setPhotos((prev) =>
        prev
          .map((x) => (x.id === editing.id ? { ...x, ...updated } : x))
          .sort((a, b) => a.sortOrder - b.sortOrder || (a.createdAt < b.createdAt ? -1 : 1)),
      );
      setEditing(null);
      toast.success("Đã lưu thay đổi.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Lỗi lưu");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="Thư viện ảnh"
        desc="Tải ảnh hoạt động, sự kiện của Hiệp hội. Ảnh được lưu trên máy chủ backend (thư mục uploads/gallery) và hiển thị ở banner trang chủ cùng trang Thư viện ảnh."
        actions={
          <>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className={PRIMARY_BTN}
              style={PRIMARY_STYLE}
            >
              {uploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              {uploading ? "Đang tải..." : "Tải ảnh lên"}
            </button>
          </>
        }
      />

      {editing !== null && (
        <PhotoForm
          key={editing.id}
          initial={editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-white/40 gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-xs">Đang tải danh sách...</span>
        </div>
      ) : photos.length === 0 ? (
        <div className="rounded-2xl border border-white/10 p-10 text-center text-white/45 text-sm">
          Chưa có ảnh nào — bấm "Tải ảnh lên" để thêm ảnh đầu tiên.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((p) => (
            <div
              key={p.id}
              className={`rounded-2xl border overflow-hidden bg-white/[0.02] ${
                p.active ? "border-white/10" : "border-white/5 opacity-60"
              }`}
            >
              <div className="relative aspect-[4/3] bg-white/5">
                <img
                  src={p.imageUrl}
                  alt={p.caption ?? ""}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2">
                  <StatusChip tone={p.active ? "green" : "slate"}>
                    {p.active ? "Đang hiện" : "Đã ẩn"}
                  </StatusChip>
                </span>
              </div>
              <div className="p-3">
                <p className="text-xs font-bold text-white/85 line-clamp-2 min-h-8">
                  {p.caption || (
                    <span className="text-white/35 font-medium">
                      Chưa có chú thích
                    </span>
                  )}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-white/40">
                    Thứ tự: {p.sortOrder}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleActive(p)}
                      title={p.active ? "Ẩn ảnh" : "Hiện ảnh"}
                      className={`${ICON_BTN} hover:text-amber-300`}
                    >
                      {p.active ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => setEditing(p)}
                      title="Sửa chú thích"
                      className={`${ICON_BTN} hover:text-white`}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => remove(p)}
                      title="Xóa"
                      className={`${ICON_BTN} hover:text-red-300`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PhotoForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: GalleryPhotoItem;
  onSave: (caption: string, sortOrder: number) => void;
  onCancel: () => void;
}) {
  const [caption, setCaption] = useState(initial.caption ?? "");
  const [sortOrder, setSortOrder] = useState(initial.sortOrder);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    try {
      await onSave(caption.trim(), Number(sortOrder) || 0);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-accent/30 bg-white/[0.02] p-5 space-y-4">
      <div className="flex items-center gap-3">
        <img
          src={initial.imageUrl}
          alt=""
          className="w-28 h-20 rounded-lg object-cover border border-white/10 shrink-0"
        />
        <div className="grid sm:grid-cols-2 gap-4 flex-1">
          <Field label="Chú thích ảnh">
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="VD: Lễ ký kết hợp tác tháng 9…"
              className={INPUT}
            />
          </Field>
          <Field label="Thứ tự hiển thị (số nhỏ hiện trước)">
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className={INPUT}
            />
          </Field>
        </div>
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
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </div>
  );
}
