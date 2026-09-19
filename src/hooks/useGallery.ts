import { useEffect, useState } from "react";
import { fetchGallery, type GalleryPhotoItem } from "@/lib/api";

/** Shared gallery fetcher for the landing banner and the gallery page. */
export function useGallery() {
  const [photos, setPhotos] = useState<GalleryPhotoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetchGallery()
      .then((data) => {
        if (alive) setPhotos(data);
      })
      .catch(() => {
        if (alive) setPhotos([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return { photos, loading };
}
