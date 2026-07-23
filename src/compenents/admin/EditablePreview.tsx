import { useEffect, useRef, useState } from "react";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  X,
  GripHorizontal,
} from "lucide-react";
import type { ArticleBlock, ArticleImage } from "@/newsData";

/**
 * WYSIWYG surface over the article preview — the Word-canvas feel:
 *
 *  - DRAG an image (pointer moves > 6px): vertical position picks which
 *    paragraph it lands between, horizontal third picks the layout
 *    (left/right = float with text wrap, middle = own line).
 *  - CLICK an image (no movement): a Word-style Layout Options popover
 *    opens next to it with every combination — position, wrap, width
 *    slider — for the cases the three drop zones can't express.
 *
 * Note on "center + text wrap": CSS floats cannot flow ONE text stream
 * around BOTH sides of a centred box (only Word's own layout engine can).
 * The combo is selectable but renders as own-line; the popover says so.
 *
 * Rendering mirrors ArticleBody (same classes), each block wrapped in a
 * plain div for hit-testing — floats overflow their zero-height wrapper,
 * so text wrap still works across wrappers.
 */

interface BlockRect {
  top: number;
  mid: number;
  bottom: number;
}

interface DragState {
  index: number;
  src: string;
  rects: BlockRect[];
  containerTop: number;
  pointerX: number;
  pointerY: number;
  targetIndex: number;
  align: ArticleImage["align"];
}

const ALIGN_LABEL: Record<ArticleImage["align"], string> = {
  left: "Trái — chữ bao quanh",
  center: "Giữa — một dòng riêng",
  right: "Phải — chữ bao quanh",
};

export function EditablePreview({
  blocks,
  onChange,
}: {
  blocks: ArticleBlock[];
  onChange: (blocks: ArticleBlock[]) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dragRef = useRef<DragState | null>(null);
  const [drag, setDragState] = useState<DragState | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const setDrag = (d: DragState | null) => {
    dragRef.current = d;
    setDragState(d);
  };

  // Escape closes the layout popover.
  useEffect(() => {
    if (selected === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const computeTarget = (x: number, y: number, d: DragState) => {
    const c = containerRef.current?.getBoundingClientRect();
    const relX = c ? (x - c.left) / c.width : 0.5;
    const align: ArticleImage["align"] =
      relX < 1 / 3 ? "left" : relX > 2 / 3 ? "right" : "center";
    let targetIndex = d.rects.length;
    for (let i = 0; i < d.rects.length; i++) {
      if (y < d.rects[i].mid) {
        targetIndex = i;
        break;
      }
    }
    return { align, targetIndex };
  };

  const patchImage = (index: number, patch: Partial<ArticleImage>) =>
    onChange(
      blocks.map((b, i) =>
        i === index && typeof b !== "string" && "src" in b
          ? { ...b, ...patch }
          : b,
      ),
    );

  /** Click = open layout popover; move past 6px = start a drag. */
  const handlePointerDown = (index: number, e: React.PointerEvent) => {
    const block = blocks[index];
    if (typeof block === "string" || !("src" in block)) return;
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    let dragging = false;

    const beginDrag = (x: number, y: number) => {
      setSelected(null);
      // Rect snapshot at drag start; layout is stable until drop.
      const rects: BlockRect[] = blocks.map((_, i) => {
        const el = blockRefs.current[i];
        let r = el?.getBoundingClientRect();
        // A floated image's wrapper div is ~zero-height; measure the figure.
        if (el && r && r.height < 8 && el.firstElementChild) {
          r = el.firstElementChild.getBoundingClientRect();
        }
        return r
          ? { top: r.top, mid: (r.top + r.bottom) / 2, bottom: r.bottom }
          : { top: 0, mid: 0, bottom: 0 };
      });
      const c = containerRef.current?.getBoundingClientRect();
      const base: DragState = {
        index,
        src: block.src,
        rects,
        containerTop: c?.top ?? 0,
        pointerX: x,
        pointerY: y,
        targetIndex: index,
        align: block.align,
      };
      setDrag({ ...base, ...computeTarget(x, y, base) });
    };

    const onMove = (ev: PointerEvent) => {
      if (!dragging) {
        if (Math.hypot(ev.clientX - startX, ev.clientY - startY) < 6) return;
        dragging = true;
        beginDrag(ev.clientX, ev.clientY);
      }
      const d = dragRef.current;
      if (!d) return;
      ev.preventDefault();
      setDrag({
        ...d,
        pointerX: ev.clientX,
        pointerY: ev.clientY,
        ...computeTarget(ev.clientX, ev.clientY, d),
      });
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      if (!dragging) {
        // Plain click: toggle the layout popover.
        setSelected((s) => (s === index ? null : index));
        return;
      }
      const d = dragRef.current;
      setDrag(null);
      if (!d) return;
      const img = blocks[d.index];
      if (typeof img === "string" || !("src" in img)) return;
      const without = blocks.filter((_, i) => i !== d.index);
      let at = d.targetIndex > d.index ? d.targetIndex - 1 : d.targetIndex;
      at = Math.max(0, Math.min(without.length, at));
      const updated: ArticleImage = {
        ...img,
        align: d.align,
        wrap: d.align === "center" ? "none" : "square",
        width: img.width ?? (d.align === "center" ? 100 : 46),
      };
      const next = [...without];
      next.splice(at, 0, updated);
      onChange(next);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  // Container-relative Y of the insertion line.
  const indicatorY =
    drag &&
    (drag.targetIndex < drag.rects.length
      ? drag.rects[drag.targetIndex].top
      : (drag.rects[drag.rects.length - 1]?.bottom ?? drag.containerTop)) -
      drag.containerTop;

  return (
    <div ref={containerRef} className="relative">
      {/* Landing-zone hint: which third the pointer is in = which layout. */}
      {drag && (
        <div
          aria-hidden
          className="absolute inset-0 z-10 grid grid-cols-3 pointer-events-none"
        >
          {(["left", "center", "right"] as const).map((zone) => (
            <div
              key={zone}
              className={`border border-dashed transition-colors rounded-lg ${
                drag.align === zone
                  ? "border-cyan-400/50 bg-cyan-400/10"
                  : "border-white/10"
              }`}
            />
          ))}
        </div>
      )}

      {/* Insertion line */}
      {drag && indicatorY !== null && (
        <div
          aria-hidden
          className="absolute left-0 right-0 z-20 h-0.5 rounded bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] pointer-events-none"
          style={{ top: indicatorY }}
        />
      )}

      {/* Body — ArticleBody's markup, block-wrapped for hit testing. */}
      <div className="mt-6 flow-root text-sm text-white/75 leading-relaxed">
        {blocks.map((block, i) => (
          <div
            key={i}
            ref={(el) => {
              blockRefs.current[i] = el;
            }}
          >
            {typeof block === "string" ? (
              <p className="mb-4">{block}</p>
            ) : "box" in block ? (
              <aside className="clear-both my-6 rounded-xl border-l-2 border-accent/60 bg-white/[0.04] px-5 py-4 text-[13.5px] font-medium text-white/85 leading-relaxed">
                {block.box}
              </aside>
            ) : (
              <PreviewImage
                block={block}
                dragging={drag?.index === i}
                selected={selected === i}
                onPointerDown={(e) => handlePointerDown(i, e)}
              />
            )}
          </div>
        ))}
      </div>

      {/* Word-style Layout Options popover for the selected image */}
      {selected !== null &&
        (() => {
          const block = blocks[selected];
          if (!block || typeof block === "string" || !("src" in block))
            return null;
          const el = blockRefs.current[selected];
          let r = el?.getBoundingClientRect();
          if (el && r && r.height < 8 && el.firstElementChild) {
            r = el.firstElementChild.getBoundingClientRect();
          }
          const c = containerRef.current?.getBoundingClientRect();
          if (!r || !c) return null;
          const left = Math.max(
            0,
            Math.min(r.left - c.left, Math.max(0, c.width - 288)),
          );
          return (
            <LayoutPopover
              block={block}
              style={{ top: r.bottom - c.top + 8, left }}
              onPatch={(patch) => patchImage(selected, patch)}
              onClose={() => setSelected(null)}
            />
          );
        })()}

      {/* Ghost following the cursor + layout badge */}
      {drag && (
        <div
          aria-hidden
          className="fixed z-50 pointer-events-none"
          style={{ left: drag.pointerX + 14, top: drag.pointerY + 14 }}
        >
          <img
            src={drag.src}
            alt=""
            referrerPolicy="no-referrer"
            className="w-28 rounded-lg border-2 border-cyan-400/80 shadow-2xl opacity-90"
          />
          <div className="mt-1.5 px-2 py-1 rounded-md bg-black/85 text-[10px] font-bold text-cyan-300 whitespace-nowrap">
            {ALIGN_LABEL[drag.align]}
          </div>
        </div>
      )}
    </div>
  );
}

/** The Word "Layout Options" card: every combination, adjusted live. */
function LayoutPopover({
  block,
  style,
  onPatch,
  onClose,
}: {
  block: ArticleImage;
  style: React.CSSProperties;
  onPatch: (patch: Partial<ArticleImage>) => void;
  onClose: () => void;
}) {
  const wrap = block.wrap ?? (block.align === "center" ? "none" : "square");
  const width = block.width ?? (wrap === "square" ? 46 : 100);
  const centerWithWrap = block.align === "center" && wrap === "square";

  const aligns = [
    { value: "left" as const, icon: AlignLeft, label: "Trái" },
    { value: "center" as const, icon: AlignCenter, label: "Giữa" },
    { value: "right" as const, icon: AlignRight, label: "Phải" },
  ];

  const seg = (active: boolean) =>
    `flex-1 px-2 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1 ${
      active ? "bg-accent/15 text-accent" : "text-white/50 hover:text-white"
    }`;

  return (
    <div
      style={style}
      className="absolute z-40 w-72 rounded-xl border border-white/15 bg-[oklch(0.16_0.04_265)] shadow-2xl p-3.5"
    >
      <div className="flex items-center mb-2.5">
        <GripHorizontal className="w-3.5 h-3.5 text-white/40 mr-1.5" />
        <span className="text-[10px] font-black uppercase tracking-wider text-white/70 mr-auto">
          Layout Options
        </span>
        <button
          onClick={onClose}
          aria-label="Đóng"
          className="p-1 rounded text-white/50 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Position */}
      <div className="flex rounded-lg border border-white/10 bg-white/[0.03] p-0.5 mb-2">
        {aligns.map((a) => (
          <button
            key={a.value}
            onClick={() => onPatch({ align: a.value })}
            className={seg(block.align === a.value)}
          >
            <a.icon className="w-3 h-3" />
            {a.label}
          </button>
        ))}
      </div>

      {/* Wrap */}
      <div className="flex rounded-lg border border-white/10 bg-white/[0.03] p-0.5 mb-2">
        <button
          onClick={() => onPatch({ wrap: "square" })}
          className={seg(wrap === "square")}
        >
          Chữ bao quanh
        </button>
        <button
          onClick={() => onPatch({ wrap: "none" })}
          className={seg(wrap === "none")}
        >
          Dòng riêng
        </button>
      </div>

      {centerWithWrap && (
        <p className="mb-2 text-[10px] leading-relaxed text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-1.5">
          Trình duyệt không thể cho chữ chảy hai bên một ảnh đặt giữa — ảnh giữa
          luôn chiếm một dòng. Muốn chữ bao quanh, chọn Trái hoặc Phải; hoặc thu
          nhỏ % rộng để chữ ôm sát trên–dưới.
        </p>
      )}

      {/* Width, live */}
      <div className="flex items-center gap-2.5">
        <span className="text-[10px] uppercase tracking-wider text-white/50 font-bold shrink-0">
          Rộng
        </span>
        <input
          type="range"
          min={20}
          max={100}
          value={width}
          onChange={(e) => onPatch({ width: Number(e.target.value) })}
          className="flex-1 accent-cyan-400"
        />
        <span className="text-[11px] font-mono text-white/70 w-10 text-right">
          {width}%
        </span>
      </div>
    </div>
  );
}

function PreviewImage({
  block,
  dragging,
  selected,
  onPointerDown,
}: {
  block: ArticleImage;
  dragging: boolean;
  selected: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
}) {
  const wrap = block.wrap ?? (block.align === "center" ? "none" : "square");
  const width = block.width ?? (wrap === "square" ? 46 : 100);
  const style = { width: `${width}%` };

  const placement =
    wrap === "square" && block.align !== "center"
      ? block.align === "left"
        ? "float-left mr-5 mb-3 mt-1 min-w-[180px]"
        : "float-right ml-5 mb-3 mt-1 min-w-[180px]"
      : `clear-both my-6 min-w-[220px] ${
          block.align === "left"
            ? "mr-auto"
            : block.align === "right"
              ? "ml-auto"
              : "mx-auto"
        }`;

  return (
    <figure
      style={style}
      onPointerDown={onPointerDown}
      className={`${placement} max-w-full cursor-grab active:cursor-grabbing touch-none select-none rounded-xl outline-2 outline-offset-2 transition-[outline-color,opacity] ${
        dragging
          ? "opacity-30 outline-dashed outline-cyan-400/80"
          : selected
            ? "outline-solid outline-cyan-400/80"
            : "outline-dashed outline-transparent hover:outline-cyan-400/50"
      }`}
    >
      <div className="rounded-xl overflow-hidden border border-white/10">
        <img
          src={block.src}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          draggable={false}
          className="w-full object-cover"
        />
      </div>
      {block.caption && (
        <figcaption className="mt-1.5 text-[10px] font-semibold text-white/50 leading-snug">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}
