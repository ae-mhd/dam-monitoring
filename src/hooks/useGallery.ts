import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { searchImages, uploadImages, deleteImage } from "@/services/galleryService";
import type { GallerySearchFilters } from "@/types";

export function useGallery(filters: GallerySearchFilters = {}) {
  const queryClient = useQueryClient();

  const galleryQuery = useQuery({
    queryKey: ["gallery", filters],
    queryFn: () => searchImages(filters),
  });

  const uploadMutation = useMutation({
    mutationFn: (files: File[]) => uploadImages(files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
  });

  return {
    images: galleryQuery.data?.data ?? [],
    pagination: {
      total: galleryQuery.data?.total ?? 0,
      currentPage: galleryQuery.data?.current_page ?? 1,
      lastPage: galleryQuery.data?.last_page ?? 1,
    },
    isLoading: galleryQuery.isLoading,
    isError: galleryQuery.isError,
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
    uploadImages: uploadMutation.mutateAsync,
    deleteImage: deleteMutation.mutateAsync,
    refresh: galleryQuery.refetch,
  };
}
