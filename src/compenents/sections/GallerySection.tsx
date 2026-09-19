import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence } from "motion/react";
import { Images, ArrowRight } from "lucide-react";
import { SectionBackground } from "@/compenents/SectionBackground";
import { seamTint } from "@/compenents/seamTint";
import { ScrollReveal } from "@/compenents/ScrollReveal";
import { SectionHeader } from "@/compenents/SectionHeader";
import { GalleryLightbox } from "@/compenents/sections/GalleryLightbox";
import { useGallery } from "@/hooks/useGallery";
import type { Lang } from "@/types";

/** One banner card. Click opens the lightbox at this photo. */
function PhotoCard({
  photo,
  lang,
  onOpen,
}: {
  photo: { id: string; imageUrl: string; caption: string | null };
  lang: Lang;
  onOpen: () => void;
}) {
  return (
    <button
      onClick={onOpen}
      className="group relative w-72 h-48 shrink-0 overflow-hidden rounded-2xl border border-white/10 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <img
        src={photo.imageUrl}
        alt={
          photo.caption ??
          (lang === "vn" ? "Ảnh thư viện DTA" : "DTA gallery photo")
        }
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <span className="absolute inset-x-0 bottom-0 p-3 pt-8 bg-gradient-to-t from-black/70 to-transparent text-left">
        <span className="text-xs font-semibold text-white line-clamp-1">
          {photo.caption ?? (lang === "vn" ? "Hoạt động DTA" : "DTA activity")}
        </span>
      </span>
    </button>
  );
}

/** Landing photo banner, placed right below the member directory. */
export function GallerySection({ lang }: { lang: Lang }) {
  const { photos, loading } = useGallery();
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (!loading && photos.length === 0) return null;

  // Hai hàng chạy ngược nhau như slider hội viên: hàng 1 xuôi, hàng 2 đảo
  // thứ tự. Mỗi hàng lặp mảng sao cho tối thiểu 6 item để vòng lặp liền mạch.
  // Riêng 1 ảnh thì hiển thị tĩnh ở giữa, không nhân bản, không chạy.
  const single = photos.length === 1;
  const repeat =
    photos.length === 0 ? 0 : single ? 1 : Math.max(2, Math.ceil(6 / photos.length));
  const base = Array.from({ length: repeat }, () => photos).flat();
  const track1 = base;
  const track2 = [...base].reverse();

  const openAt = (id: string) =>
    setLightbox(Math.max(0, photos.findIndex((p) => p.id === id)));

  return (
    <section id="gallery" className="py-20 md:py-28 relative overflow-hidden">
      <SectionBackground
        variant="grid"
        tintTop={seamTint.deepMoss}
        tintBottom={seamTint.moss}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeader
          title={
            <>
              {lang === "vn" ? "Thư viện ảnh" : "Photo Gallery"}
              <br />
              <span className="text-gradient-cyan">
                {lang === "vn"
                  ? "Khoảnh khắc & Hoạt động DTA"
                  : "DTA Moments & Activities"}
              </span>
            </>
          }
          subtitle={
            lang === "vn"
              ? "Những hình ảnh nổi bật về hoạt động, sự kiện và cộng đồng hội viên Hiệp hội Công nghệ số Đà Nẵng."
              : "Highlights of events, activities and the member community of the Danang Digital Technology Association."
          }
        />
      </div>

      {/* Infinite photo banner */}
      <div className="relative z-10 mt-10 overflow-hidden select-none w-full [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]">
        {loading ? (
          <div className="flex gap-4 px-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-72 h-48 shrink-0 rounded-2xl card-surface animate-pulse"
              />
            ))}
          </div>
        ) : single ? (
          <div className="flex justify-center px-6">
            <PhotoCard photo={photos[0]} lang={lang} onOpen={() => setLightbox(0)} />
          </div>
        ) : (
          <>
            {/* Row 1: Left sliding — chậm hơn slider hội viên */}
            <div
              className="flex gap-4 animate-marquee mb-4 py-2 hover:[animation-play-state:paused]"
              style={{ animationDuration: "70s" }}
            >
              {track1.map((photo, idx) => (
                <PhotoCard
                  key={`${photo.id}-r1-${idx}`}
                  photo={photo}
                  lang={lang}
                  onOpen={() => openAt(photo.id)}
                />
              ))}
            </div>
            {/* Row 2: Right sliding — chậm hơn slider hội viên */}
            <div
              className="flex gap-4 animate-marquee-reverse py-2 hover:[animation-play-state:paused]"
              style={{ animationDuration: "70s" }}
            >
              {track2.map((photo, idx) => (
                <PhotoCard
                  key={`${photo.id}-r2-${idx}`}
                  photo={photo}
                  lang={lang}
                  onOpen={() => openAt(photo.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <ScrollReveal className="relative z-10 mt-8 flex justify-center">
        <Link
          to="/thu-vien-anh"
          className="px-6 py-3 rounded-full text-xs font-bold border border-white/20 hover:bg-white/5 active:scale-95 transition-all duration-300 flex items-center gap-2 cursor-pointer text-white"
        >
          <Images className="w-4 h-4 text-accent" />
          <span>{lang === "vn" ? "Xem thêm ảnh" : "View all photos"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </ScrollReveal>

      <AnimatePresence>
        {lightbox !== null && (
          <GalleryLightbox
            photos={photos}
            index={lightbox}
            lang={lang}
            onClose={() => setLightbox(null)}
            onNav={setLightbox}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
