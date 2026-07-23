import type { ArticleBlock, ArticleImage } from "@/newsData";

/**
 * Article body renderer — Word-style layout options. Shared by the portal
 * article page AND the admin editor's live preview, so what the editor sees
 * is exactly what publishes. `body` is a block list the editor arranges
 * freely:
 *  - string           -> paragraph
 *  - { box }          -> highlight box between paragraphs
 *  - { src, align, wrap, width } -> image; wrap "square" floats it so text
 *    flows around (Word: Square), wrap "none" puts it on its own line
 *    (Word: Top and Bottom) anchored left/right/center at the chosen width.
 * flow-root contains the floats so whatever follows never wraps around a
 * trailing image.
 */
export function ArticleBody({ body }: { body: ArticleBlock[] }) {
  return (
    /* Full column width — the right edge of text and centred images lines
       up exactly with the lead image above (no narrower 70ch column). */
    <div className="mt-6 flow-root text-sm text-white/75 leading-relaxed">
      {body.map((block, i) => {
        if (typeof block === "string") {
          return (
            <p key={i} className="mb-4">
              {block}
            </p>
          );
        }

        if ("box" in block) {
          return (
            <aside
              key={i}
              className="clear-both my-6 rounded-xl border-l-2 border-accent/60 bg-white/[0.04] px-5 py-4 text-[13.5px] font-medium text-white/85 leading-relaxed"
            >
              {block.box}
            </aside>
          );
        }

        // Word defaults: left/right wraps text (Square), center is own-line.
        const wrap =
          block.wrap ?? (block.align === "center" ? "none" : "square");
        const width = block.width ?? (wrap === "square" ? 46 : 100);
        const style = { width: `${width}%` };

        if (wrap === "square" && block.align !== "center") {
          // Text flows around the image.
          const float =
            block.align === "left"
              ? "float-left mr-5 mb-3 mt-1"
              : "float-right ml-5 mb-3 mt-1";
          return (
            <figure
              key={i}
              style={style}
              className={`${float} min-w-[180px] max-w-full`}
            >
              <ArticleImageBox block={block} />
            </figure>
          );
        }

        // Own line (Top and Bottom), anchored by align at the chosen width.
        const anchor =
          block.align === "left"
            ? "mr-auto"
            : block.align === "right"
              ? "ml-auto"
              : "mx-auto";
        return (
          <figure
            key={i}
            style={style}
            className={`clear-both my-6 ${anchor} min-w-[220px] max-w-full`}
          >
            <ArticleImageBox block={block} />
          </figure>
        );
      })}
    </div>
  );
}

/** Image + caption, shared by every image placement. */
function ArticleImageBox({ block }: { block: ArticleImage }) {
  return (
    <>
      <div className="rounded-xl overflow-hidden border border-white/10">
        <img
          src={block.src}
          alt={block.caption ?? ""}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full object-cover"
        />
      </div>
      {block.caption && (
        <figcaption className="mt-1.5 text-[10px] font-semibold text-white/50 leading-snug">
          {block.caption}
        </figcaption>
      )}
    </>
  );
}
