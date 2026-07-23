import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Reorder, useDragControls } from "motion/react";
import { toast } from "sonner";
import {
  Type,
  Image as ImageIcon,
  Square,
  Trash2,
  ArrowUp,
  ArrowDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Eye,
  PencilLine,
  Save,
  Send,
  Upload,
  X,
  FileDown,
  LayoutList,
  FileUp,
  GripVertical,
  MousePointerClick,
} from "lucide-react";
import {
  textToBlocks,
  blocksToText,
  docxToBlocks,
  exportArticlePdf,
} from "@/compenents/admin/bodyFormats";
import {
  mainTopics,
  type PortalArticle,
  type ArticleBlock,
  type ArticleImage,
} from "@/newsData";
import { newArticleId } from "@/compenents/admin/adminStore";
import { EditablePreview } from "@/compenents/admin/EditablePreview";
import { ArticleBody } from "@/compenents/news/ArticleBody";

/**
 * Word-style article editor. The body is the same block list the portal
 * renders (paragraph / image with align+wrap+width / highlight box), and the
 * preview pane renders through the SAME ArticleBody component the article
 * page uses — what the editor sees is exactly what publishes.
 */
export function ArticleEditor({
  initial,
  onSave,
}: {
  initial?: PortalArticle;
  onSave: (article: PortalArticle, publish: boolean) => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [topicSlug, setTopicSlug] = useState(
    initial?.topic ?? mainTopics[0].slug,
  );
  const [categorySlug, setCategorySlug] = useState(
    initial?.category ?? mainTopics[0].categories[0].slug,
  );
  const [date, setDate] = useState(initial?.date ?? todayVn());
  const [author, setAuthor] = useState(initial?.author ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [tags, setTags] = useState(initial?.tags.join(", ") ?? "");
  const [pdfUrl, setPdfUrl] = useState(initial?.pdfUrl ?? "");
  const [memberUrl, setMemberUrl] = useState(initial?.memberUrl ?? "");
  const [isIntern, setIsIntern] = useState(initial?.isIntern ?? false);
  const [blocks, setBlocks] = useState<ArticleBlock[]>(initial?.body ?? [""]);
  const [showPreview, setShowPreview] = useState(false);
  /* Direct-manipulation mode on the preview: drag images in the rendered
     article itself instead of via the block list. */
  const [editInPreview, setEditInPreview] = useState(false);
  const hasImageBlock = blocks.some((b) => typeof b !== "string" && "src" in b);

  const topic = useMemo(
    () => mainTopics.find((t) => t.slug === topicSlug) ?? mainTopics[0],
    [topicSlug],
  );

  const buildArticle = (publish: boolean): PortalArticle | null => {
    if (!title.trim() || !summary.trim()) {
      toast.error("Cần nhập tối thiểu Tiêu đề và Tóm tắt.");
      return null;
    }
    return {
      id: initial?.id ?? newArticleId(),
      title: title.trim(),
      summary: summary.trim(),
      topic: topic.slug,
      category:
        topic.categories.find((c) => c.slug === categorySlug)?.slug ??
        topic.categories[0].slug,
      date: date.trim() || todayVn(),
      image: image.trim() || `https://picsum.photos/seed/${Date.now()}/800/450`,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      views: initial?.views ?? 0,
      pdfUrl: pdfUrl.trim() || undefined,
      memberUrl: memberUrl.trim() || undefined,
      isIntern: isIntern || undefined,
      author: author.trim() || undefined,
      status: publish ? "published" : "draft",
      // Drop empty paragraphs so stray enters don't publish as gaps.
      body: blocks.filter((b) => typeof b !== "string" || b.trim() !== ""),
    };
  };

  const submit = (publish: boolean) => {
    const article = buildArticle(publish);
    if (article) onSave(article, publish);
  };

  const preview = buildPreview();
  function buildPreview(): PortalArticle {
    return {
      id: "preview",
      title: title || "(Chưa có tiêu đề)",
      summary,
      topic: topic.slug,
      category: categorySlug,
      date,
      image,
      tags: [],
      views: initial?.views ?? 0,
      body: blocks,
    };
  }

  return (
    <div className="space-y-6">
      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setShowPreview((v) => !v)}
          className="xl:hidden flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-xs font-bold text-white/70 hover:text-white transition-colors cursor-pointer"
        >
          {showPreview ? (
            <>
              <PencilLine className="w-3.5 h-3.5" /> Soạn thảo
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" /> Xem trước
            </>
          )}
        </button>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => {
              if (
                !exportArticlePdf({
                  title: title || "(Chưa có tiêu đề)",
                  summary,
                  image: image || undefined,
                  author,
                  date,
                  body: blocks,
                })
              ) {
                toast.error(
                  "Trình duyệt chặn cửa sổ mới — cho phép popup để xuất PDF.",
                );
              }
            }}
            title="Mở hộp thoại in — chọn Save as PDF"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-xs font-bold text-white/80 hover:text-white hover:border-white/25 transition-colors cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" /> Xuất PDF
          </button>
          <button
            onClick={() => submit(false)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-xs font-bold text-white/80 hover:text-white hover:border-white/25 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" /> Lưu nháp
          </button>
          <button
            onClick={() => submit(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-primary-foreground hover:opacity-90 active:scale-98 transition-all cursor-pointer"
            style={{
              background: "var(--gradient-primary)",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            <Send className="w-3.5 h-3.5" /> Xuất bản
          </button>
        </div>
      </div>

      <div className="grid xl:grid-cols-2 gap-6 items-start">
        {/* ---------- form ---------- */}
        <div className={`space-y-5 ${showPreview ? "hidden xl:block" : ""}`}>
          <Field label="Tiêu đề *">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tiêu đề bài viết"
              className={INPUT}
            />
          </Field>

          <Field label="Tóm tắt (sapo) *">
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={2}
              placeholder="Vài dòng giới thiệu hiện dưới tiêu đề và trên trang danh sách"
              className={`${INPUT} resize-none`}
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Chủ đề chính">
              <select
                value={topicSlug}
                onChange={(e) => {
                  const t = mainTopics.find((x) => x.slug === e.target.value);
                  setTopicSlug(e.target.value);
                  if (t) setCategorySlug(t.categories[0].slug);
                }}
                className={INPUT}
              >
                {mainTopics.map((t) => (
                  <option key={t.slug} value={t.slug}>
                    {t.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Chuyên mục">
              <select
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className={INPUT}
              >
                {topic.categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Ngày đăng (dd/mm/yyyy)">
              <input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={INPUT}
              />
            </Field>
            <Field label="Tác giả (trống = DTA News)">
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Ví dụ: Minh Châu"
                className={INPUT}
              />
            </Field>
          </div>

          <Field label="Ảnh đại diện — dán URL hoặc chọn file từ máy">
            <ImageInput
              value={image}
              onChange={setImage}
              placeholder="https://…  (trống = ảnh mẫu tự sinh)"
            />
          </Field>

          <Field label="Tags (phân cách bằng dấu phẩy)">
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Chính sách, Vi mạch"
              className={INPUT}
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="File PDF đính kèm (URL)">
              <input
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                placeholder="/documents/…"
                className={INPUT}
              />
            </Field>
            <Field label="Link website hội viên">
              <input
                value={memberUrl}
                onChange={(e) => setMemberUrl(e.target.value)}
                placeholder="https://…"
                className={INPUT}
              />
            </Field>
          </div>

          {categorySlug === "tuyen-dung" && (
            <label className="flex items-center gap-2 text-xs text-white/75 cursor-pointer">
              <input
                type="checkbox"
                checked={isIntern}
                onChange={(e) => setIsIntern(e.target.checked)}
                className="accent-cyan-400"
              />
              Tin Thực tập sinh (được ghim đầu chuyên mục Tuyển dụng)
            </label>
          )}

          <BodyEditor blocks={blocks} onChange={setBlocks} />
        </div>

        {/* ---------- live preview ---------- */}
        <div
          className={`rounded-2xl border border-white/10 bg-[oklch(0.10_0.06_265)] p-6 ${
            showPreview ? "" : "hidden xl:block"
          }`}
        >
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mr-auto">
              Xem trước — đúng giao diện trang tin
            </div>
            <button
              onClick={() => setEditInPreview((v) => !v)}
              disabled={!hasImageBlock}
              title={
                hasImageBlock
                  ? "Kéo ảnh ngay trong bản xem trước"
                  : "Thêm ít nhất một block Ảnh để dùng"
              }
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-default ${
                editInPreview
                  ? "border-accent/50 bg-accent/15 text-accent"
                  : "border-white/10 bg-white/[0.03] text-white/60 hover:text-white"
              }`}
            >
              <MousePointerClick className="w-3 h-3" />
              {editInPreview ? "Đang chỉnh trực tiếp" : "Chỉnh trực tiếp"}
            </button>
          </div>
          {editInPreview && (
            <p className="mb-3 -mt-2 text-[10px] text-white/45 leading-relaxed">
              Nắm một ảnh và kéo: lên/xuống = đổi vị trí giữa các đoạn; sang mép{" "}
              <strong className="text-white/70">trái/phải</strong> = chữ bao
              quanh; thả ở <strong className="text-white/70">giữa</strong> = ảnh
              một dòng riêng.
            </p>
          )}
          <h1 className="display text-xl md:text-2xl font-black text-white leading-[1.25] tracking-tight">
            {preview.title}
          </h1>
          {summary && (
            <p className="mt-4 text-sm text-white/85 font-medium leading-relaxed border-l-2 border-accent/60 pl-4">
              {summary}
            </p>
          )}
          {image && (
            <div className="mt-5 rounded-2xl overflow-hidden border border-white/10">
              <img
                src={image}
                alt=""
                referrerPolicy="no-referrer"
                className="w-full aspect-[16/9] object-cover"
              />
            </div>
          )}
          {editInPreview ? (
            <EditablePreview blocks={blocks} onChange={setBlocks} />
          ) : (
            <ArticleBody body={blocks} />
          )}
          <p className="mt-6 text-right text-sm text-white/85 clear-both">
            <span className="text-white/50 font-normal">Tác giả: </span>
            <span className="font-bold">{author.trim() || "DTA News"}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- body editor: 3 authoring modes ---------------- */

type BodyMode = "block" | "word" | "import";

const MODES: { value: BodyMode; label: string; icon: typeof Type }[] = [
  { value: "block", label: "Block", icon: LayoutList },
  { value: "word", label: "Đánh máy (Word)", icon: Type },
  { value: "import", label: "Import file", icon: FileUp },
];

/**
 * Wraps the body editing surface with a mode switch:
 *  - "block":  the structured block list (default)
 *  - "word":   one continuous typing surface, like drafting in Word —
 *              blank line = new paragraph, "> " = BOX, ![c](url) = image;
 *              parsed live into the same block model, so the preview and
 *              publish output are identical to block mode
 *  - "import": load a .md / .docx file into the block list
 */
function BodyEditor({
  blocks,
  onChange,
}: {
  blocks: ArticleBlock[];
  onChange: (blocks: ArticleBlock[]) => void;
}) {
  const [mode, setMode] = useState<BodyMode>("block");
  const [text, setText] = useState("");
  const lastParsed = useRef<ArticleBlock[] | null>(null);

  const switchMode = (next: BodyMode) => {
    // Entering the typing surface: serialise current blocks so nothing is
    // lost; leaving it needs no action — every keystroke already synced.
    if (next === "word") setText(blocksToText(blocks));
    setMode(next);
  };

  /* While typing, `blocks` updates come from our own parse — but a drag in
     the live preview also rewrites them. Re-serialise the textarea when the
     change wasn't ours, so the typing surface shows the new order. */
  useEffect(() => {
    if (mode === "word" && blocks !== lastParsed.current) {
      setText(blocksToText(blocks));
    }
  }, [mode, blocks]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <span className="text-[10px] uppercase tracking-wider text-white/60 font-bold">
          Nội dung bài viết
        </span>
        <div className="flex rounded-lg border border-white/10 bg-white/[0.03] p-0.5">
          {MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => switchMode(m.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                mode === m.value
                  ? "bg-accent/15 text-accent"
                  : "text-white/50 hover:text-white"
              }`}
            >
              <m.icon className="w-3 h-3" />
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {mode === "block" && (
        <BlockListEditor blocks={blocks} onChange={onChange} />
      )}

      {mode === "word" && (
        <div>
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              const parsed = textToBlocks(e.target.value);
              lastParsed.current = parsed;
              onChange(parsed);
            }}
            rows={18}
            placeholder={
              "Gõ liền mạch như soạn Word…\n\nCách một dòng trống = sang đoạn mới.\n\n> Dòng bắt đầu bằng dấu lớn hơn = BOX điểm nhấn.\n\n![Chú thích ảnh](https://link-anh){align=right width=40}"
            }
            className={`${INPUT} resize-y font-mono leading-relaxed`}
          />
          <p className="mt-1.5 text-[10px] text-white/40 leading-relaxed">
            Dòng trống = đoạn mới · <code>&gt; …</code> = BOX ·{" "}
            <code>
              ![chú thích](url)&#123;align=left|right|center width=40
              wrap=square|none&#125;
            </code>{" "}
            = ảnh. Chuyển về tab Block để tinh chỉnh từng ảnh bằng nút bấm.
          </p>
        </div>
      )}

      {mode === "import" && (
        <ImportPanel
          hasContent={blocks.some(
            (b) => typeof b !== "string" || b.trim() !== "",
          )}
          onImport={(imported, replace) => {
            onChange(replace ? imported : [...blocks, ...imported]);
            setMode("block");
          }}
        />
      )}
    </div>
  );
}

/** File import: .md/.txt parse through the flow-text syntax, .docx is
 *  unzipped and read natively (text only — embedded images re-added by
 *  hand, since they live outside document.xml). */
function ImportPanel({
  hasContent,
  onImport,
}: {
  hasContent: boolean;
  onImport: (blocks: ArticleBlock[], replace: boolean) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handle = async (file: File) => {
    try {
      const isDocx = file.name.toLowerCase().endsWith(".docx");
      const imported = isDocx
        ? await docxToBlocks(file)
        : textToBlocks(await file.text());
      if (imported.length === 0) {
        toast.error("File không có nội dung đọc được.");
        return;
      }
      const replace = hasContent
        ? window.confirm(
            "Thay thế toàn bộ nội dung hiện tại?\nOK = thay thế · Cancel = nối vào cuối bài.",
          )
        : true;
      onImport(imported, replace);
      toast.success(
        `Đã nhập ${imported.length} block từ ${file.name}.` +
          (isDocx ? " Ảnh trong file Word cần thêm lại thủ công." : ""),
      );
    } catch {
      toast.error("Không đọc được file — cần .docx, .md hoặc .txt hợp lệ.");
    }
  };

  return (
    <div className="rounded-xl border border-dashed border-white/20 p-8 text-center">
      <FileUp className="w-6 h-6 mx-auto mb-3 text-white/30" />
      <p className="text-xs text-white/60 max-w-md mx-auto leading-relaxed">
        Nhập bài viết từ file{" "}
        <strong className="text-white/85">Word (.docx)</strong> hoặc{" "}
        <strong className="text-white/85">Markdown (.md, .txt)</strong>. Mỗi
        đoạn văn thành một block; với Markdown, cú pháp <code>&gt;</code> và{" "}
        <code>![…](…)</code> thành BOX và ảnh.
      </p>
      <button
        onClick={() => fileRef.current?.click()}
        className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-xs font-bold text-white/80 hover:text-accent hover:border-accent/50 transition-colors cursor-pointer"
      >
        <Upload className="w-3.5 h-3.5" />
        Chọn file .docx / .md
      </button>
      <input
        ref={fileRef}
        type="file"
        accept=".docx,.md,.markdown,.txt"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handle(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

/* ---------------- block editor ---------------- */

/** Stable identity per block so drag reordering and React keys survive
 *  moves (a bare index key would re-mount inputs mid-drag). */
interface BlockItem {
  id: string;
  block: ArticleBlock;
}
let blockIdCounter = 0;
const newBlockItem = (block: ArticleBlock): BlockItem => ({
  id: `blk-${++blockIdCounter}`,
  block,
});

/**
 * Block list with drag-to-reorder (motion's Reorder: layout-animated, the
 * other blocks glide out of the way while dragging). The grip handle is the
 * only drag surface, so text inputs inside a card stay fully editable;
 * the ↑/↓ buttons remain as the keyboard-accessible fallback.
 *
 * Identity note: this component OWNS the id-wrapped list; parent mode
 * switches remount it (conditional render in BodyEditor), so initialising
 * from props once is safe.
 */
function BlockListEditor({
  blocks,
  onChange,
}: {
  blocks: ArticleBlock[];
  onChange: (blocks: ArticleBlock[]) => void;
}) {
  const [items, setItems] = useState<BlockItem[]>(() =>
    blocks.map(newBlockItem),
  );
  const lastCommitted = useRef<ArticleBlock[]>(blocks);
  const commit = (next: BlockItem[]) => {
    setItems(next);
    const mapped = next.map((i) => i.block);
    lastCommitted.current = mapped;
    onChange(mapped);
  };

  /* External edits (dragging an image in the live preview) also change
     `blocks`; when the incoming array is not the one WE produced, rebuild
     the id-wrapped list so both surfaces stay in sync. */
  useEffect(() => {
    if (blocks !== lastCommitted.current) {
      lastCommitted.current = blocks;
      setItems(blocks.map(newBlockItem));
    }
  }, [blocks]);

  const update = (id: string, block: ArticleBlock) =>
    commit(items.map((i) => (i.id === id ? { ...i, block } : i)));
  const remove = (id: string) => commit(items.filter((i) => i.id !== id));
  const move = (id: string, dir: -1 | 1) => {
    const i = items.findIndex((x) => x.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    commit(next);
  };
  const add = (block: ArticleBlock) => commit([...items, newBlockItem(block)]);

  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-white/60 font-bold mb-2">
        Kéo tay nắm ⠿ để sắp xếp — như kéo thả trong Word
      </div>

      <Reorder.Group
        axis="y"
        values={items}
        onReorder={commit}
        className="space-y-3"
      >
        {items.map((item, i) => (
          <BlockCard
            key={item.id}
            item={item}
            index={i}
            count={items.length}
            onUpdate={update}
            onRemove={remove}
            onMove={move}
          />
        ))}
      </Reorder.Group>

      {/* Add-block toolbar */}
      <div className="flex flex-wrap gap-2 mt-3">
        <AddBtn onClick={() => add("")}>
          <Type className="w-3.5 h-3.5" /> Đoạn văn
        </AddBtn>
        <AddBtn onClick={() => add({ src: "", align: "center" })}>
          <ImageIcon className="w-3.5 h-3.5" /> Ảnh
        </AddBtn>
        <AddBtn onClick={() => add({ box: "" })}>
          <Square className="w-3.5 h-3.5" /> BOX điểm nhấn
        </AddBtn>
      </div>
    </div>
  );
}

function BlockCard({
  item,
  index,
  count,
  onUpdate,
  onRemove,
  onMove,
}: {
  item: BlockItem;
  index: number;
  count: number;
  onUpdate: (id: string, block: ArticleBlock) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, dir: -1 | 1) => void;
}) {
  const controls = useDragControls();
  const { block } = item;

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      whileDrag={{
        scale: 1.02,
        boxShadow: "0 16px 40px rgba(0,0,0,0.45)",
        zIndex: 10,
      }}
      className="relative rounded-xl border border-white/10 bg-[oklch(0.15_0.04_265)] p-3"
    >
      <div className="flex items-center gap-1.5 mb-2">
        {/* Drag handle — the ONLY drag surface. touch-none stops mobile
            browsers from scrolling instead of dragging. */}
        <button
          onPointerDown={(e) => {
            e.preventDefault();
            controls.start(e);
          }}
          title="Kéo để di chuyển"
          aria-label="Kéo để di chuyển block"
          className="p-1 -ml-1 rounded text-white/35 hover:text-white cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <span className="text-[10px] font-black uppercase tracking-wider text-accent mr-auto">
          {typeof block === "string"
            ? "Đoạn văn"
            : "box" in block
              ? "BOX điểm nhấn"
              : "Ảnh"}
        </span>
        <IconBtn
          label="Lên"
          onClick={() => onMove(item.id, -1)}
          disabled={index === 0}
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </IconBtn>
        <IconBtn
          label="Xuống"
          onClick={() => onMove(item.id, 1)}
          disabled={index === count - 1}
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </IconBtn>
        <IconBtn label="Xóa block" onClick={() => onRemove(item.id)} danger>
          <Trash2 className="w-3.5 h-3.5" />
        </IconBtn>
      </div>

      {typeof block === "string" ? (
        <textarea
          value={block}
          onChange={(e) => onUpdate(item.id, e.target.value)}
          rows={3}
          placeholder="Nội dung đoạn văn…"
          className={`${INPUT} resize-y`}
        />
      ) : "box" in block ? (
        <textarea
          value={block.box}
          onChange={(e) => onUpdate(item.id, { box: e.target.value })}
          rows={2}
          placeholder="Trích dẫn / con số nổi bật…"
          className={`${INPUT} resize-y border-l-2 border-l-accent/60`}
        />
      ) : (
        <ImageBlockEditor
          block={block}
          onChange={(b) => onUpdate(item.id, b)}
        />
      )}
    </Reorder.Item>
  );
}

/** Word's Layout Options panel for one image: position, wrap, width — the
 *  same combinations (and the same center+wrap caveat) as the popover in
 *  the live preview, so both surfaces behave identically. */
function ImageBlockEditor({
  block,
  onChange,
}: {
  block: ArticleImage;
  onChange: (block: ArticleImage) => void;
}) {
  const wrap = block.wrap ?? (block.align === "center" ? "none" : "square");
  const width = block.width ?? (wrap === "square" ? 46 : 100);
  const centerWithWrap = block.align === "center" && wrap === "square";
  const aligns = [
    { value: "left" as const, icon: AlignLeft, label: "Trái" },
    { value: "center" as const, icon: AlignCenter, label: "Giữa" },
    { value: "right" as const, icon: AlignRight, label: "Phải" },
  ];

  return (
    <div className="space-y-3">
      <ImageInput
        value={block.src}
        onChange={(src) => onChange({ ...block, src })}
      />
      <input
        value={block.caption ?? ""}
        onChange={(e) =>
          onChange({ ...block, caption: e.target.value || undefined })
        }
        placeholder="Chú thích ảnh (tùy chọn)"
        className={INPUT}
      />

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        {/* Position */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-white/50 font-bold">
            Vị trí
          </span>
          <div className="flex rounded-lg border border-white/10 bg-white/[0.03] p-0.5">
            {aligns.map((a) => (
              <button
                key={a.value}
                title={a.label}
                onClick={() => onChange({ ...block, align: a.value })}
                className={`px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                  block.align === a.value
                    ? "bg-accent/15 text-accent"
                    : "text-white/50 hover:text-white"
                }`}
              >
                <a.icon className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
        </div>

        {/* Wrap — every combination selectable, like the preview popover */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-white/50 font-bold">
            Chữ
          </span>
          <div className="flex rounded-lg border border-white/10 bg-white/[0.03] p-0.5">
            <button
              onClick={() => onChange({ ...block, wrap: "square" })}
              className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                wrap === "square"
                  ? "bg-accent/15 text-accent"
                  : "text-white/50 hover:text-white"
              }`}
            >
              Bao quanh
            </button>
            <button
              onClick={() => onChange({ ...block, wrap: "none" })}
              className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                wrap === "none"
                  ? "bg-accent/15 text-accent"
                  : "text-white/50 hover:text-white"
              }`}
            >
              Dòng riêng
            </button>
          </div>
        </div>

        {/* Width, live slider */}
        <div className="flex items-center gap-2 flex-1 min-w-[180px]">
          <span className="text-[10px] uppercase tracking-wider text-white/50 font-bold shrink-0">
            Rộng
          </span>
          <input
            type="range"
            min={20}
            max={100}
            value={width}
            onChange={(e) =>
              onChange({ ...block, width: Number(e.target.value) })
            }
            className="flex-1 accent-cyan-400"
          />
          <span className="text-[11px] font-mono text-white/70 w-10 text-right">
            {width}%
          </span>
        </div>
      </div>

      {centerWithWrap && (
        <p className="text-[10px] leading-relaxed text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-1.5">
          Trình duyệt không thể cho chữ chảy hai bên một ảnh đặt giữa — ảnh giữa
          luôn chiếm một dòng. Muốn chữ bao quanh, chọn Trái hoặc Phải; hoặc thu
          nhỏ % rộng để chữ ôm sát trên–dưới.
        </p>
      )}
    </div>
  );
}

/* ---------------- image source: URL or local file ---------------- */

/**
 * Read a local image, downscale it on a canvas and return a JPEG data URL.
 * Storage is localStorage until the real backend exists, so images must be
 * kept small — 1400px on the long edge at q0.85 keeps a photo well under
 * the quota while staying sharp at column width.
 */
function fileToDataUrl(file: File, maxDim = 1400): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("canvas unavailable"));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("not an image"));
    };
    img.src = objectUrl;
  });
}

/**
 * One image source field, two ways to fill it: paste a URL, or pick a file
 * from the machine (converted to an embedded data URL). An uploaded image
 * replaces the text input with a compact chip + remove button — a megabyte
 * of base64 in a text box is uneditable noise.
 */
export function ImageInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const isDataUrl = value.startsWith("data:");

  const pick = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("File được chọn không phải ảnh.");
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      if (dataUrl.length > 1_500_000) {
        toast.warning(
          "Ảnh khá nặng sau khi nén — bản demo lưu trên trình duyệt nên hạn chế dùng nhiều ảnh cỡ này.",
        );
      }
      onChange(dataUrl);
    } catch {
      toast.error("Không đọc được file ảnh.");
    }
  };

  return (
    <div className="flex gap-2 items-center">
      {isDataUrl ? (
        <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white/70">
          <ImageIcon className="w-3.5 h-3.5 text-accent shrink-0" />
          <span className="truncate">Ảnh tải từ máy (đã nén)</span>
          <button
            onClick={() => onChange("")}
            title="Gỡ ảnh"
            aria-label="Gỡ ảnh"
            className="ml-auto p-0.5 rounded text-white/50 hover:text-red-300 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "URL ảnh (https://…)"}
          className={INPUT}
        />
      )}
      <button
        onClick={() => fileRef.current?.click()}
        title="Chọn ảnh từ máy"
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-[11px] font-bold text-white/70 hover:text-accent hover:border-accent/50 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
      >
        <Upload className="w-3.5 h-3.5" />
        Chọn file
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void pick(f);
          e.target.value = ""; // same file can be re-picked
        }}
      />
      {value && (
        <img
          src={value}
          alt=""
          referrerPolicy="no-referrer"
          className="w-20 h-12 rounded-lg object-cover border border-white/10 shrink-0"
        />
      )}
    </div>
  );
}

/* ---------------- small shared pieces ---------------- */

const INPUT =
  "w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/60";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-wider text-white/60 font-bold mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function IconBtn({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`p-1.5 rounded-lg border border-white/10 bg-white/[0.03] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-default ${
        danger
          ? "text-white/50 hover:text-red-300"
          : "text-white/50 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function AddBtn({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-white/20 text-[11px] font-bold text-white/60 hover:text-accent hover:border-accent/50 transition-colors cursor-pointer"
    >
      {children}
    </button>
  );
}

function todayVn() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}
