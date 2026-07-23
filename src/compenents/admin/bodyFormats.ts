import type { ArticleBlock, ArticleImage } from "@/newsData";

/**
 * Conversions between the article block model and other authoring formats:
 *  - a markdown-flavoured plain text ("kiểu đánh Word" free-typing mode,
 *    also what .md imports parse through)
 *  - .docx import (zip + WordprocessingML, decoded natively in the browser)
 *  - print/PDF export via the browser's print dialog
 */

/* ---------------- blocks <-> flow text ---------------- */

const clampWidth = (n: number) => Math.min(100, Math.max(20, Math.round(n)));

/**
 * Flow-text syntax, one block per blank-line-separated chunk:
 *   plain text                 -> paragraph
 *   > quoted text              -> highlight BOX
 *   ![caption](url){align=right wrap=square width=40} -> image
 * The {…} attribute group is optional and mirrors the Word layout options.
 */
export function textToBlocks(text: string): ArticleBlock[] {
  const blocks: ArticleBlock[] = [];
  for (const raw of text.split(/\n\s*\n/)) {
    const chunk = raw.trim();
    if (!chunk) continue;

    const img = chunk.match(/^!\[([^\]]*)\]\(([^)\s]+)\)(?:\{([^}]*)\})?$/);
    if (img) {
      const attrs = Object.fromEntries(
        (img[3] ?? "")
          .split(/\s+/)
          .filter(Boolean)
          .map((kv) => kv.split("=") as [string, string]),
      );
      const align = ["left", "right", "center"].includes(attrs.align)
        ? (attrs.align as ArticleImage["align"])
        : "center";
      const block: ArticleImage = { src: img[2], align };
      if (img[1]) block.caption = img[1];
      if (attrs.wrap === "square" || attrs.wrap === "none")
        block.wrap = attrs.wrap;
      if (attrs.width && !Number.isNaN(Number(attrs.width)))
        block.width = clampWidth(Number(attrs.width));
      blocks.push(block);
      continue;
    }

    if (chunk.startsWith(">")) {
      blocks.push({
        box: chunk
          .split("\n")
          .map((l) => l.replace(/^>\s?/, ""))
          .join(" ")
          .trim(),
      });
      continue;
    }

    // Markdown headings/emphasis degrade to plain paragraphs — the block
    // model has no heading level, and losing `#` marks beats keeping them.
    blocks.push(
      chunk
        .replace(/^#{1,6}\s+/, "")
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .replace(/\n/g, " "),
    );
  }
  return blocks;
}

export function blocksToText(blocks: ArticleBlock[]): string {
  return blocks
    .map((b) => {
      if (typeof b === "string") return b;
      if ("box" in b) return `> ${b.box}`;
      const attrs = [`align=${b.align}`];
      if (b.wrap) attrs.push(`wrap=${b.wrap}`);
      if (b.width) attrs.push(`width=${b.width}`);
      return `![${b.caption ?? ""}](${b.src}){${attrs.join(" ")}}`;
    })
    .join("\n\n");
}

/* ---------------- .docx import ---------------- */

/**
 * Minimal zip reader: walk the central directory for word/document.xml and
 * inflate it with the native DecompressionStream — no library needed for
 * the one entry we care about. Embedded images are NOT extracted (they live
 * as separate zip entries); the editor tells the user to re-add them.
 */
async function extractDocumentXml(buf: ArrayBuffer): Promise<string> {
  const bytes = new Uint8Array(buf);
  const view = new DataView(buf);

  // End-of-central-directory record, scanned from the tail (comment may follow).
  let eocd = -1;
  const stop = Math.max(0, bytes.length - 22 - 65535);
  for (let i = bytes.length - 22; i >= stop; i--) {
    if (view.getUint32(i, true) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error("not a zip");

  const count = view.getUint16(eocd + 10, true);
  let offset = view.getUint32(eocd + 16, true);
  const decoder = new TextDecoder();

  for (let n = 0; n < count; n++) {
    if (view.getUint32(offset, true) !== 0x02014b50) break;
    const method = view.getUint16(offset + 10, true);
    const compSize = view.getUint32(offset + 20, true);
    const nameLen = view.getUint16(offset + 28, true);
    const extraLen = view.getUint16(offset + 30, true);
    const commentLen = view.getUint16(offset + 32, true);
    const localOffset = view.getUint32(offset + 42, true);
    const name = decoder.decode(
      bytes.subarray(offset + 46, offset + 46 + nameLen),
    );

    if (name === "word/document.xml") {
      const lNameLen = view.getUint16(localOffset + 26, true);
      const lExtraLen = view.getUint16(localOffset + 28, true);
      const dataStart = localOffset + 30 + lNameLen + lExtraLen;
      const data = bytes.subarray(dataStart, dataStart + compSize);
      if (method === 0) return decoder.decode(data);
      if (method === 8) {
        const stream = new Blob([data])
          .stream()
          .pipeThrough(new DecompressionStream("deflate-raw"));
        return await new Response(stream).text();
      }
      throw new Error("unsupported zip compression");
    }
    offset += 46 + nameLen + extraLen + commentLen;
  }
  throw new Error("word/document.xml not found");
}

const decodeXmlEntities = (s: string) =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");

/** .docx -> paragraph blocks. Visible text lives in <w:t> runs; one
 *  <w:p> = one paragraph. Formatting (bold, styles) is dropped. */
export async function docxToBlocks(file: File): Promise<ArticleBlock[]> {
  const xml = await extractDocumentXml(await file.arrayBuffer());
  return xml
    .split(/<\/w:p>/)
    .map((chunk) =>
      Array.from(chunk.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g))
        .map((m) => decodeXmlEntities(m[1]))
        .join("")
        .trim(),
    )
    .filter((t) => t !== "");
}

/* ---------------- PDF export (browser print dialog) ---------------- */

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Open a print-ready window with the article laid out on white (print
 * palette, Arial per the association's format reference) and invoke the
 * print dialog — "Save as PDF" is the export path, no PDF library needed.
 */
export function exportArticlePdf(article: {
  title: string;
  summary: string;
  image?: string;
  author?: string;
  date: string;
  body: ArticleBlock[];
}) {
  const bodyHtml = article.body
    .map((b) => {
      if (typeof b === "string") return `<p>${esc(b)}</p>`;
      if ("box" in b) return `<div class="box">${esc(b.box)}</div>`;
      const wrap = b.wrap ?? (b.align === "center" ? "none" : "square");
      const width = b.width ?? (wrap === "square" ? 46 : 100);
      const style =
        wrap === "square" && b.align !== "center"
          ? `float:${b.align};width:${width}%;margin:${
              b.align === "left" ? "4px 16px 8px 0" : "4px 0 8px 16px"
            };`
          : `clear:both;width:${width}%;margin:16px ${
              b.align === "left"
                ? "auto 16px 0"
                : b.align === "right"
                  ? "0 16px auto"
                  : "auto"
            };`;
      const cap = b.caption ? `<figcaption>${esc(b.caption)}</figcaption>` : "";
      return `<figure style="${style}"><img src="${b.src}" alt=""/>${cap}</figure>`;
    })
    .join("\n");

  const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"/>
<title>${esc(article.title)}</title>
<style>
  body { font-family: Arial, Helvetica, sans-serif; font-size: 13px; line-height: 1.6; color: #111; max-width: 720px; margin: 24px auto; padding: 0 16px; }
  h1 { font-size: 24px; line-height: 1.3; margin: 0 0 12px; }
  .meta { color: #666; font-size: 11px; margin-bottom: 16px; }
  .sapo { font-weight: bold; border-left: 3px solid #888; padding-left: 12px; margin: 0 0 16px; }
  .lead img { width: 100%; border-radius: 6px; }
  article { display: flow-root; }
  p { margin: 0 0 12px; }
  figure { margin: 0; }
  figure img { width: 100%; border-radius: 6px; }
  figcaption { font-size: 9px; font-weight: bold; color: #555; margin-top: 4px; }
  .box { clear: both; border-left: 3px solid #888; background: #f4f4f4; padding: 10px 14px; margin: 14px 0; font-weight: 500; }
  .author { clear: both; text-align: right; font-weight: bold; margin-top: 18px; }
  @page { margin: 18mm 16mm; }
</style></head><body>
<h1>${esc(article.title)}</h1>
<div class="meta">${esc(article.date)} — DTA News</div>
${article.summary ? `<p class="sapo">${esc(article.summary)}</p>` : ""}
${article.image ? `<div class="lead"><img src="${article.image}" alt=""/></div>` : ""}
<article>${bodyHtml}</article>
<div class="author">Tác giả: ${esc(article.author?.trim() || "DTA News")}</div>
</body></html>`;

  const win = window.open("", "_blank");
  if (!win) return false;
  win.document.write(html);
  win.document.close();
  // Give remote images a beat to arrive before the print snapshot.
  win.onload = () => setTimeout(() => win.print(), 400);
  return true;
}
