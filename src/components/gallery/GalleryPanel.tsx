import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  X,
  Download,
} from "@/components/ui/Icons";
import { PageHeader } from "@/components/layout/PageHeader";
import { useGallery } from "@/hooks/useGallery";
import { cn } from "@/lib/utils";
import { GALLERY_IMAGES } from "@/lib/constants";

export function GalleryPanel() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    filename: string;
  } | null>(null);

  const { images, deleteImage, pagination } = useGallery({
    pagination: { per_page: 12, current_page: page },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm(t("gallery.confirmDelete"))) {
      try {
        await deleteImage(id);
      } catch (error) {
        console.error("Delete failed", error);
      }
    }
  };

  const allImages = [...GALLERY_IMAGES, ...images];

  return (
    <div className="flex flex-col gap-5 min-h-0">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <PageHeader
          icon={ImageIcon}
          title={t("sidebar.gallery")}
          description={t("gallery.description")}
        />

        {/* Upload Button hidden per user request */}
      </div>
      {allImages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 glass rounded-2xl border-dashed">
          <div className="p-4 rounded-full bg-muted/10">
            <ImageIcon size={48} className="text-muted" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-medium text-primary">
              {t("gallery.noImages")}
            </h3>
            <p className="text-sm text-muted max-w-xs mx-auto mt-1">
              {t("gallery.noImagesDesc")}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
          {allImages.map((image) => (
            <div
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className="group relative aspect-square glass rounded-xl overflow-hidden border-card hover:border-sky-500/50 transition-all duration-300 shadow-lg hover:shadow-sky-500/10 cursor-zoom-in"
            >
              <img
                src={image.url}
                alt={image.filename}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-white/90 truncate font-medium">
                    {image.filename}
                  </span>
                  {!image.id.startsWith("g") && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(image.id);
                      }}
                      className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white transition-all backdrop-blur-md border border-red-500/30"
                      title={t("gallery.deleteImage")}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.lastPage > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4 pb-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg glass border-card hover:border-sky-500/50 disabled:opacity-30 disabled:pointer-events-none transition-all"
          >
            <RefreshCw
              size={16}
              className={cn(page === 1 ? "" : "rotate-180")}
            />
          </button>
          <span className="text-sm text-muted px-4">
            {t("analytics.page")} {page} / {pagination.lastPage}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pagination.lastPage, p + 1))}
            disabled={page === pagination.lastPage}
            className="p-2 rounded-lg glass border-card hover:border-sky-500/50 disabled:opacity-30 disabled:pointer-events-none transition-all"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      )}

      {/* Image Popup / Zoom Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

          <div
            className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center gap-4 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 right-0 flex items-center gap-2 p-4">
              <button
                onClick={() => setSelectedImage(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-2xl glass border-white/10 shadow-2xl">
              <img
                src={selectedImage.url}
                alt={selectedImage.filename}
                className="max-w-full max-h-full object-contain animate-in zoom-in-95 duration-300"
              />
            </div>

            <div className="flex items-center justify-between w-full px-2">
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-white">
                  {selectedImage.filename}
                </h3>
                <p className="text-sm text-white/60">
                  {t("sidebar.gallery")} • {t("gallery.visualRecord")}
                </p>
              </div>
              <a
                href={selectedImage.url}
                download={selectedImage.filename}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black transition-all border border-white/10 font-medium text-sm"
              >
                <Download size={16} />
                <span>{t("gallery.viewFullSize")}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
