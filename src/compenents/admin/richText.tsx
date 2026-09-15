/* eslint-disable react-refresh/only-export-components -- file cố ý export helpers + components toolbar */
import { useRef, useState, type ReactNode } from "react";
import { Bold, Italic, Palette, Eraser } from "lucide-react";

/**
 * Rich-text nhẹ cho block đoạn văn / BOX.
 * Model lưu: string có thể chứa subset HTML an toàn:
 *   <strong> / <b>  — bôi đậm
 *   <em> / <i>      — in nghiêng (tùy chọn)
 *   <span style="color:#..."> — đổi màu chữ
 *   <br> — xuống dòng trong cùng block
 * Ngoài ra vẫn hiểu cú pháp tay **bold** để tương thích bài cũ / gõ Word.
 *
 * Backend không cần migrate: NewsBlock.text là Text, DTO chỉ IsString.
 */

export const PRESET_COLORS = [
  { name: "Đỏ", value: "#e11d48" },
  { name: "Cam", value: "#ea580c" },
  { name: "Vàng", value: "#ca8a04" },
  { name: "Xanh lá", value: "#16a34a" },
  { name: "Xanh dương", value: "#2563eb" },
  { name: "Cyan", value: "#0891b2" },
  { name: "Tím", value: "#7c3aed" },
  { name: "Hồng", value: "#db2777" },
] as const;

const HEX_COLOR = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const CSS_COLOR_FN =
  /^(rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)|rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*(0|1|0?\.\d+)\s*\)|hsl\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*\))$/;
const NAMED_COLORS = new Set([
  "black",
  "white",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "cyan",
  "purple",
  "pink",
  "gray",
  "grey",
  "brown",
]);

export function isValidColor(c: string): boolean {
  const v = c.trim().toLowerCase();
  return HEX_COLOR.test(v) || CSS_COLOR_FN.test(v) || NAMED_COLORS.has(v);
}

function extractColor(style: string): string | null {
  const m = style.match(/color\s*:\s*([^;]+)/i);
  if (!m) return null;
  const c = m[1].trim().replace(/['"]/g, "");
  return isValidColor(c) ? c : null;
}

/** Bỏ tags + markdown để kiểm tra rỗng / đếm ký tự thật. */
export function stripRichText(s: string): string {
  return s
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/?(?:strong|b|em|i|u|s|span)(?:\s[^>]*)?>/gi, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\[color=[^\]]+\]([\s\S]*?)\[\/color\]/gi, "$1")
    .trim();
}

export function isRichTextEmpty(s: string): boolean {
  return stripRichText(s ?? "") === "";
}

/** HTML an toàn cho export PDF / bất kỳ nơi nào cần string HTML. */
export function toSafeHtml(source: string): string {
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  // Chuẩn hóa markdown tay trước
  const tmp = normalizeMarkdown(source ?? "");
  // Escape toàn bộ rồi mở lại allowlist
  let out = esc(tmp);
  // <br>
  out = out.replace(/&lt;br\s*\/?&gt;/gi, "<br>");
  // <strong>/<b>/<em>/<i>
  out = out.replace(/&lt;\/?(strong|b|em|i)&gt;/gi, (m) =>
    m.replace(/&lt;/g, "<").replace(/&gt;/g, ">"),
  );
  // <span style="color:..."> — chỉ mở khi màu hợp lệ (chấp nhận " và ')
  out = out.replace(
    /&lt;span\s+style=(?:"([^"]*)"|'([^']*)')\s*&gt;/gi,
    (_m, d1: string, d2: string) => {
      const style = d1 ?? d2 ?? "";
      const mm = String(style).match(/color\s*:\s*([^;]+)/i);
      const c = mm?.[1]?.trim().replace(/['"]/g, "") ?? "";
      return isValidColor(c) ? `<span style="color:${c}">` : "";
    },
  );
  out = out.replace(/&lt;\/span&gt;/gi, "</span>");
  // Cân bằng thẻ span: opening invalid đã bị bỏ nên closing thừa phải gỡ
  const opens = (out.match(/<span\b/gi) ?? []).length;
  const closes = (out.match(/<\/span>/gi) ?? []).length;
  for (let k = 0; k < closes - opens; k++) {
    out = out.replace("</span>", "");
  }
  // Xuống dòng trong block thành <br>
  out = out.replace(/\n/g, "<br>");
  return out;
}

/** Chuyển cú pháp tay sang HTML subset trước khi parse/render. */
function normalizeMarkdown(input: string): string {
  return (
    input
      // [color=#e11d48]...[/color] -> span
      .replace(
        /\[color=([^\]]+)\]([\s\S]*?)\[\/color\]/gi,
        (_m, c: string, inner: string) =>
          isValidColor(String(c).trim())
            ? `<span style="color:${String(c).trim()}">${inner}</span>`
            : inner,
      )
      // **bold** -> strong (không ăn thẻ HTML đang có)
      .replace(/\*\*([^*<>]+)\*\*/g, "<strong>$1</strong>")
  );
}

interface SpanCtx {
  color: string | null;
}

function renderWithColor(
  text: string,
  key: string,
  bold: boolean,
  italic: boolean,
  color: string | null,
): ReactNode {
  let node: ReactNode = text;
  if (color) node = <span style={{ color }}>{node}</span>;
  if (bold) node = <strong className="font-bold">{node}</strong>;
  if (italic) node = <em>{node}</em>;
  // bọc key ở tầng ngoài cùng
  return <span key={key}>{node}</span>;
}

/**
 * Parse HTML subset + markdown thành React nodes an toàn.
 * Không dùng dangerouslySetInnerHTML — text thường React tự escape.
 */
export function renderRichText(source: string): ReactNode[] {
  const input = normalizeMarkdown(source);
  // Tách tags allowlist, giữ delimiter
  const parts = input.split(
    /(<\/?(?:strong|b|em|i|br)(?:\s[^>]*)?>|<\/?span(?:\s[^>]*)?>)/gi,
  );
  const out: ReactNode[] = [];
  let bold = false;
  let italic = false;
  const colorStack: SpanCtx[] = [];
  const currentColor = () =>
    [...colorStack].reverse().find((s) => s.color)?.color ?? null;
  let key = 0;

  const pushText = (raw: string) => {
    // Giữ xuống dòng trong block
    const lines = raw.split(/\n/);
    lines.forEach((line, li) => {
      if (line) {
        out.push(
          renderWithColor(line, `t-${key++}`, bold, italic, currentColor()),
        );
      }
      if (li < lines.length - 1) out.push(<br key={`br-${key++}`} />);
    });
  };

  for (const part of parts) {
    if (!part) continue;
    const tag = part.match(/^<\/?(strong|b|em|i|br|span)(\s[^>]*)?\/?>$/i);
    if (!tag) {
      pushText(part);
      continue;
    }
    const name = tag[1].toLowerCase();
    const isClose = part.startsWith("</");
    const isSelfClose = /\/>$/.test(part) || name === "br";
    if (name === "br") {
      out.push(<br key={`br-${key++}`} />);
    } else if (name === "strong" || name === "b") {
      bold = !isClose;
    } else if (name === "em" || name === "i") {
      italic = !isClose;
    } else if (name === "span") {
      if (isClose || isSelfClose) {
        colorStack.pop();
      } else {
        const c = extractColor(tag[2] ?? "");
        colorStack.push({ color: c });
      }
    }
  }
  return out;
}

/* ---------------- thao tác trên textarea ---------------- */

export interface Selection {
  start: number;
  end: number;
}

function splice(
  value: string,
  start: number,
  end: number,
  insert: string,
): { next: string; sel: Selection } {
  const s = Math.max(0, Math.min(start, value.length));
  const e = Math.max(s, Math.min(end, value.length));
  const next = value.slice(0, s) + insert + value.slice(e);
  return { next, sel: { start: s, end: s + insert.length } };
}

export function toggleBold(
  value: string,
  start: number,
  end: number,
): { next: string; sel: Selection } {
  if (start === end) {
    return splice(value, start, end, "<strong>văn bản đậm</strong>");
  }
  const sel = value.slice(start, end);
  // Đã bôi đậm rồi -> gỡ ra
  const unwrapped = sel.match(/^<strong>([\s\S]*)<\/strong>$/);
  if (unwrapped) {
    const next = value.slice(0, start) + unwrapped[1] + value.slice(end);
    return {
      next,
      sel: { start, end: start + unwrapped[1].length },
    };
  }
  return splice(value, start, end, `<strong>${sel}</strong>`);
}

export function toggleItalic(
  value: string,
  start: number,
  end: number,
): { next: string; sel: Selection } {
  if (start === end) {
    return splice(value, start, end, "<em>văn bản nghiêng</em>");
  }
  const sel = value.slice(start, end);
  const unwrapped = sel.match(/^<em>([\s\S]*)<\/em>$/);
  if (unwrapped) {
    const next = value.slice(0, start) + unwrapped[1] + value.slice(end);
    return {
      next,
      sel: { start, end: start + unwrapped[1].length },
    };
  }
  return splice(value, start, end, `<em>${sel}</em>`);
}

export function applyColor(
  value: string,
  start: number,
  end: number,
  color: string,
): { next: string; sel: Selection } | null {
  if (!isValidColor(color)) return null;
  if (start === end) {
    return splice(
      value,
      start,
      end,
      `<span style="color:${color}">văn bản màu</span>`,
    );
  }
  const sel = value.slice(start, end);
  return splice(
    value,
    start,
    end,
    `<span style="color:${color}">${sel}</span>`,
  );
}

export function clearFormatting(
  value: string,
  start: number,
  end: number,
): { next: string; sel: Selection } {
  const s = Math.min(start, end);
  const e = Math.max(start, end);
  const target = s === e ? value : value.slice(s, e);
  const cleaned = stripRichText(target).replace(/\s+/g, " ");
  if (s === e) return { next: cleaned, sel: { start: 0, end: cleaned.length } };
  const next = value.slice(0, s) + cleaned + value.slice(e);
  return { next, sel: { start: s, end: s + cleaned.length } };
}

/* ---------------- UI: toolbar + textarea ---------------- */

export function RichTextToolbar({
  textareaRef,
  value,
  onChange,
}: {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (next: string) => void;
}) {
  const [showColors, setShowColors] = useState(false);
  const customRef = useRef<HTMLInputElement>(null);

  const run = (
    fn: (
      v: string,
      s: number,
      e: number,
    ) => { next: string; sel: Selection } | null,
  ) => {
    const el = textareaRef.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    const res = fn(value, start, end);
    if (!res) return;
    onChange(res.next);
    requestAnimationFrame(() => {
      if (!el) return;
      el.focus();
      el.setSelectionRange(res.sel.start, res.sel.end);
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
      <div className="flex rounded-lg border border-white/10 bg-white/[0.03] p-0.5">
        <button
          type="button"
          title="Bôi đậm (chọn chữ rồi bấm B, hoặc bấm để chèn mẫu)"
          onClick={() => run(toggleBold)}
          className="px-2.5 py-1.5 rounded-md text-white/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          title="In nghiêng"
          onClick={() => run(toggleItalic)}
          className="px-2.5 py-1.5 rounded-md text-white/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          title="Màu chữ"
          onClick={() => setShowColors((v) => !v)}
          className={`px-2.5 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
            showColors
              ? "bg-accent/15 text-accent"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase">Màu</span>
        </button>
        <button
          type="button"
          title="Xóa định dạng trong vùng chọn"
          onClick={() => run(clearFormatting)}
          className="px-2.5 py-1.5 rounded-md text-white/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <Eraser className="w-3.5 h-3.5" />
        </button>
      </div>
      {showColors && (
        <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-[oklch(0.16_0.04_265)] px-2 py-1.5">
          {PRESET_COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              title={c.name}
              onClick={() => run((v, s, e) => applyColor(v, s, e, c.value))}
              className="w-5 h-5 rounded-full border border-white/20 hover:scale-110 transition-transform cursor-pointer"
              style={{ background: c.value }}
            />
          ))}
          <button
            type="button"
            title="Màu tùy chọn"
            onClick={() => customRef.current?.click()}
            className="w-5 h-5 rounded-full border border-dashed border-white/30 text-[9px] text-white/60 hover:text-white cursor-pointer"
          >
            +
          </button>
          <input
            ref={customRef}
            type="color"
            className="hidden"
            onChange={(e) =>
              run((v, s, e2) => applyColor(v, s, e2, e.target.value))
            }
          />
        </div>
      )}
      <span className="text-[10px] text-white/35 ml-auto hidden sm:inline">
        Bôi đen chữ rồi bấm <b>B</b> / chọn màu · gõ tay <code>**đậm**</code>{" "}
        cũng được
      </span>
    </div>
  );
}

export function RichTextArea({
  value,
  onChange,
  rows = 3,
  placeholder,
  className,
}: {
  value: string;
  onChange: (next: string) => void;
  rows?: number;
  placeholder?: string;
  className?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  return (
    <div>
      <RichTextToolbar textareaRef={ref} value={value} onChange={onChange} />
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className={className}
      />
    </div>
  );
}
