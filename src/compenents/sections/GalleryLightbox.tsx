import { useEffect } from "react";
import { motion } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryPhotoItem } from "@/lib/api";
import type { Lang } from "@/types";

interface GalleryLightboxProps {
  photos: GalleryPhotoItem[];
  index: number;
  lang: Lang;
  onClose: () => void;
  onNav: (index: number) => void;
}

/** Shared fullscreen viewer for the gallery banner and gallery page. */
export function GalleryLightbox({
  photos,
  index,
  lang,
  onClose,
  onNav,
}: GalleryLightboxProps) {
  const photo = photos[index];
  const total = photos.length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav((index + 1) % total);
      if (e.key === "ArrowLeft") onNav((index - 1 + total) % total);
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [index, total, onClose, onNav]);

  if (!photo) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
      />
      <motion.figure
        key={photo.id}
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 max-w-4xl w-full"
      >
        <img
          src={photo.imageUrl}
          alt={photo.caption ?? (lang === "vn" ? "Ảnh thư viện DTA" : "DTA gallery photo")}
          className="w-full max-h-[75dvh] object-contain rounded-2xl border border-white/10 bg-black/40"
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <figcaption className="text-sm text-white/80 leading-relaxed min-w-0">
            {photo.caption || (
              <span className="text-white/40">
                {lang === "vn" ? "Ảnh hoạt động DTA" : "DTA activity photo"}
              </span>
            )}
          </figcaption>
          <span className="text-xs font-mono text-white/50 shrink-0">
            {index + 1} / {total}
          </span>
        </div>
        {total > 1 && (
          <>
            <button
              onClick={() => onNav((index - 1 + total) % total)}
              aria-label={lang === "vn" ? "Ảnh trước" : "Previous photo"}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/15 text-white flex items-center justify-center hover:bg-black/80 active:scale-90 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNav((index + 1) % total)}
              aria-label={lang === "vn" ? "Ảnh tiếp" : "Next photo"}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/15 text-white flex items-center justify-center hover:bg-black/80 active:scale-90 transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
        <button
          onClick={onClose}
          aria-label={lang === "vn" ? "Đóng" : "Close"}
          className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:opacity-90 active:scale-90 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.figure>
    </div>
  );
}
