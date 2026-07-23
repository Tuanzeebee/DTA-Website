import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Pencil,
  Download,
  Upload,
  X,
  FileText,
} from "lucide-react";
import {
  resourceStore,
  genId,
  RESOURCE_CATEGORIES,
  type ResourceDoc,
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

/** Ấn phẩm & Tài nguyên: kho văn bản (thông tư, nghị định, biểu mẫu, ấn
 *  phẩm DTA) admin tự đăng — nguồn cho chuyên mục "Tài nguyên – Chính sách
 *  mới" và nút PDF trong bài viết. */
export const Route = createFileRoute("/admin/tai-nguyen")({
  component: AdminResources,
});

const categoryLabel = (c: ResourceDoc["category"]) =>
  RESOURCE_CATEGORIES.find((x) => x.value === c)?.label ?? c;

function AdminResources() {
  const docs = resourceStore.useItems();
  const [editing, setEditing] = useState<ResourceDoc | "new" | null>(null);

  const remove = (d: ResourceDoc) => {
    if (!window.confirm(`Xóa tài nguyên “${d.title}”?`)) return;
    resourceStore.remove(d.id);
    if (editing !== null && editing !== "new" && editing.id === d.id)
      setEditing(null);
    toast.success("Đã xóa tài nguyên.");
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="Ấn phẩm & Tài nguyên"
        desc="Kho văn bản dùng chung: thông tư, nghị định, biểu mẫu, ấn phẩm của Hiệp hội. Đăng tại đây rồi dán đường dẫn file vào trường PDF của bài viết để độc giả tải về."
        actions={
          <button
            onClick={() => setEditing("new")}
            className={PRIMARY_BTN}
            style={PRIMARY_STYLE}
          >
            <Plus className="w-3.5 h-3.5" />
            Đăng tài nguyên
          </button>
        }
      />

      {editing !== null && (
        <ResourceForm
          key={editing === "new" ? "new" : editing.id}
          initial={editing === "new" ? undefined : editing}
          onSave={(d) => {
            resourceStore.save(d);
            setEditing(null);
            toast.success(
              editing === "new" ? "Đã đăng tài nguyên." : "Đã lưu thay đổi.",
            );
          }}
          onCancel={() => setEditing(null)}
        />
      )}

      <div className="rounded-2xl border border-white/10 overflow-x-auto">
        <table className="w-full text-xs min-w-[760px]">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03]">
              <th className={TH}>Tài nguyên</th>
              <th className={TH}>Loại</th>
              <th className={TH}>Ngày</th>
              <th className={TH}>File</th>
              <th className={`${TH} text-right`}>Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {docs.map((d) => (
              <tr key={d.id} className="hover:bg-white/[0.02]">
                <td className="px-4 py-3 max-w-[360px]">
                  <div className="font-bold text-white/85 line-clamp-2">
                    {d.title}
                  </div>
                  <div className="text-[10px] text-white/40 font-mono">
                    {d.code ?? d.id}
                  </div>
                  {d.desc && (
                    <div className="text-[11px] text-white/50 line-clamp-1 mt-0.5">
                      {d.desc}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <StatusChip tone="cyan">
                    {categoryLabel(d.category)}
                  </StatusChip>
                </td>
                <td className="px-4 py-3 text-white/60 font-mono whitespace-nowrap">
                  {d.date}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={d.fileUrl}
                    download
                    className="inline-flex items-center gap-1 text-accent hover:text-cyan-300 transition-colors font-bold"
                  >
                    <Download className="w-3 h-3" />
                    Tải PDF
                  </a>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => setEditing(d)}
                      title="Sửa"
                      className={`${ICON_BTN} hover:text-white`}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => remove(d)}
                      title="Xóa"
                      className={`${ICON_BTN} hover:text-red-300`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {docs.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-white/45"
                >
                  Kho trống — bấm “Đăng tài nguyên”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ResourceForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: ResourceDoc;
  onSave: (d: ResourceDoc) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [code, setCode] = useState(initial?.code ?? "");
  const [category, setCategory] = useState<ResourceDoc["category"]>(
    initial?.category ?? "thong-tu",
  );
  const [date, setDate] = useState(initial?.date ?? todayVn());
  const [fileUrl, setFileUrl] = useState(initial?.fileUrl ?? "");
  const [desc, setDesc] = useState(initial?.desc ?? "");

  const submit = () => {
    if (!title.trim() || !fileUrl.trim()) {
      toast.error("Cần nhập Tiêu đề và File (URL hoặc chọn từ máy).");
      return;
    }
    onSave({
      id: initial?.id ?? genId("res"),
      title: title.trim(),
      code: code.trim() || undefined,
      category,
      date: date.trim() || todayVn(),
      fileUrl: fileUrl.trim(),
      desc: desc.trim() || undefined,
    });
  };

  return (
    <div className="rounded-2xl border border-accent/30 bg-white/[0.02] p-5 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Tiêu đề văn bản / ấn phẩm *">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Thông tư hướng dẫn…"
            className={INPUT}
          />
        </Field>
        <Field label="Số hiệu (nếu có)">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="12/2026/TT-BKHCN"
            className={INPUT}
          />
        </Field>
        <Field label="Loại">
          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as ResourceDoc["category"])
            }
            className={INPUT}
          >
            {RESOURCE_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Ngày ban hành (dd/mm/yyyy)">
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={INPUT}
          />
        </Field>
      </div>

      <Field label="File PDF — dán URL hoặc chọn file từ máy *">
        <PdfInput value={fileUrl} onChange={setFileUrl} />
      </Field>

      <Field label="Mô tả ngắn">
        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Toàn văn kèm phụ lục biểu mẫu…"
          className={INPUT}
        />
      </Field>

      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className={GHOST_BTN}>
          Hủy
        </button>
        <button onClick={submit} className={PRIMARY_BTN} style={PRIMARY_STYLE}>
          <Plus className="w-3.5 h-3.5" />
          {initial ? "Lưu thay đổi" : "Đăng tài nguyên"}
        </button>
      </div>
    </div>
  );
}

/** PDF source: paste a URL, or pick a local file (stored as a data URL —
 *  demo storage is the browser, so files above ~2MB get a warning). */
function PdfInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const isDataUrl = value.startsWith("data:");

  const pick = (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("File được chọn không phải PDF.");
      return;
    }
    if (file.size > 2_000_000) {
      toast.warning(
        "File khá nặng — bản demo lưu trên trình duyệt, nên ưu tiên file dưới 2MB hoặc dán URL.",
      );
    }
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result));
    reader.onerror = () => toast.error("Không đọc được file.");
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex gap-2 items-center">
      {isDataUrl ? (
        <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white/70">
          <FileText className="w-3.5 h-3.5 text-accent shrink-0" />
          <span className="truncate">File PDF tải từ máy</span>
          <button
            onClick={() => onChange("")}
            title="Gỡ file"
            aria-label="Gỡ file"
            className="ml-auto p-0.5 rounded text-white/50 hover:text-red-300 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/documents/… hoặc https://…"
          className={INPUT}
        />
      )}
      <button
        onClick={() => fileRef.current?.click()}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-[11px] font-bold text-white/70 hover:text-accent hover:border-accent/50 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
      >
        <Upload className="w-3.5 h-3.5" />
        Chọn file
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) pick(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function todayVn() {
  const d = new Date();
  const p = (x: number) => String(x).padStart(2, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
}
