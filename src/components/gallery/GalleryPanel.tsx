import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Plus,
  Loader2,
  RefreshCw,
} from "@/components/ui/Icons";
import { PageHeader } from "@/components/layout/PageHeader";
import { useGallery } from "@/hooks/useGallery";
import { cn } from "@/lib/utils";

export function GalleryPanel() {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [page, setPage] = useState(1);

  const {
    images,
    isLoading,
    isUploading,
    uploadImages,
    deleteImage,
    pagination,
  } = useGallery({
    pagination: { per_page: 12, current_page: page },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      try {
        await uploadImages(Array.from(files));
      } catch (error) {
        console.error("Upload failed", error);
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t("gallery.confirmDelete"))) {
      try {
        await deleteImage(id);
      } catch (error) {
        console.error("Delete failed", error);
      }
    }
  };

  return (
    <div className="flex flex-col gap-5 min-h-0">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <PageHeader
          icon={ImageIcon}
          title={t("sidebar.gallery")}
          description={t("gallery.description")}
        />

        <div className="flex items-center gap-3">
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
              "bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/20 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
            )}
          >
            {isUploading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Upload size={16} />
            )}
            <span>{t("gallery.uploadImages")}</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 size={40} className="text-sky-500 animate-spin" />
          <p className="text-muted text-sm">{t("analytics.syncing")}</p>
        </div>
      ) : images.length === 0 ? (
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
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 text-sky-500 hover:text-sky-400 text-sm font-medium flex items-center gap-1.5"
          >
            <Plus size={16} /> {t("gallery.startUploading")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-square glass rounded-xl overflow-hidden border-card hover:border-sky-500/50 transition-all duration-300 shadow-lg hover:shadow-sky-500/10"
            >
              <img
                src={image.url}
                alt={image.filename}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-white/90 truncate font-medium">
                    {image.filename}
                  </span>
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white transition-all backdrop-blur-md border border-red-500/30"
                    title={t("gallery.deleteImage")}
                  >
                    <Trash2 size={14} />
                  </button>
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
    </div>
  );
}
