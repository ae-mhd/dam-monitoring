import api from "./api";
import type {
  GalleryImage,
  GallerySearchFilters,
  PaginatedResponse,
} from "@/types";

/**
 * Upload multiple images to the gallery
 * POST /galleries/batchUpload
 */
export async function uploadImages(files: File[]): Promise<void> {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files[]", file);
  });

  formData.append("type", "general");

  await api.post("/galleries/batchUpload", formData, {
    headers: {
      Accept: "application/json",
    },
    transformRequest: (data) => data,
  });
}
/**
 * Search/List gallery images
 * POST /galleries/search
 */
export async function searchImages(
  filters: GallerySearchFilters = {},
): Promise<PaginatedResponse<GalleryImage>> {
  const { data } = await api.post<PaginatedResponse<GalleryImage>>(
    "/galleries/search",
    {
      pagination: {
        per_page: filters.pagination?.per_page ?? 20,
        current_page: filters.pagination?.current_page ?? 1,
      },
      search: filters.search ?? "",
      type: filters.type ?? "",
    },
  );
  return data;
}

/**
 * Delete a gallery image
 * DELETE /galleries/delete/{id}
 */
export async function deleteImage(id: string): Promise<void> {
  await api.delete(`/galleries/delete/${id}`);
}
