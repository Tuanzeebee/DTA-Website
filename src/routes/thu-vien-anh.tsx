import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { Images } from "lucide-react";
import { useLang, useSession } from "@/hooks/useLang";
import { PageShell } from "@/compenents/layout/PageShell";
import { Nav } from "@/compenents/layout/Nav";
import { Footer } from "@/compenents/layout/Footer";
import { GalleryLightbox } from "@/compenents/sections/GalleryLightbox";
import { useGallery } from "@/hooks/useGallery";
import { authService } from "@/lib/auth/service";

export const Route = createFileRoute("/thu-vien-anh")({
  component: GalleryPage,
});

function GalleryPage() {
  const { lang, toggleLang } = useLang();
  const { isLoggedIn } = useSession(lang);
  const role = authService.getRole();
  const { photos, loading } = useGallery();
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <PageShell>
      <Nav
        lang={lang}
        toggleLang={toggleLang}
        isLoggedIn={isLoggedIn}
        role={role}
      />
      <main className="flex-grow pt-28 md:pt-32 pb-20 px-4 md:px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-10">
            <p className="text-[11px] md:text-xs tracking-[0.25em] font-bold text-accent uppercase mb-4 flex items-center gap-2">
              <Images className="w-4 h-4" />
              {lang === "vn" ? "Thư viện ảnh" : "Photo Gallery"}
            </p>
            <h1 className="display text-3xl sm:text-4xl md:text-5xl font-black leading-[1.25] text-white">
              {lang === "vn" ? "Khoảnh khắc" : "Moments"}{" "}
              <span className="text-gradient-gold">
                {lang === "vn" ? "& Hoạt động DTA" : "& DTA Activities"}
              </span>
            </h1>
            <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
              {lang === "vn"
                ? "Tuyển tập hình ảnh về hoạt động, sự kiện và cộng đồng hội viên Hiệp hội Công nghệ số Đà Nẵng. Bấm vào ảnh để xem chi tiết."
                : "A collection of photos from events, activities and the member community of the Danang Digital Technology Association. Click a photo to view details."}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="aspect-[4/3] rounded-2xl card-surface animate-pulse"
                />
              ))}
            </div>
          ) : photos.length === 0 ? (
            <div className="card-surface rounded-3xl p-12 text-center">
              <Images className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                {lang === "vn"
                  ? "Thư viện ảnh đang được cập nhật. Vui lòng quay lại sau."
                  : "The gallery is being updated. Please come back later."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo, idx) => (
                <button
                  key={photo.id}
                  onClick={() => setLightbox(idx)}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
                      {photo.caption ??
                        (lang === "vn" ? "Hoạt động DTA" : "DTA activity")}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer lang={lang} />

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
    </PageShell>
  );
}
