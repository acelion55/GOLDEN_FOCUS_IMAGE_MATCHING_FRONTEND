"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { apiFetch } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

interface Photo {
  _id: string;
  imageUrl: string;
  originalFilename: string;
  eventName: string;
  faceCount: number;
  isProcessed: boolean;
  processingError?: string;
  downloadCount: number;
  createdAt: string;
}

interface Pagination {
  page: number;
  total: number;
  pages: number;
}

export default function PhotosPage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId") || "";

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchPhotos = useCallback(async (p: number) => {
    setIsLoading(true);
    const params = new URLSearchParams({ page: String(p), limit: "24" });
    if (eventId) params.set("eventId", eventId);
    const res = await apiFetch(`/api/photographer/photos?${params}`);
    const data = await res.json();
    setPhotos(data.photos || []);
    setPagination(data.pagination);
    setIsLoading(false);
  }, [eventId]);

  useEffect(() => { fetchPhotos(page); }, [page, fetchPhotos]);

  const deletePhoto = async (id: string) => {
    if (!confirm("Delete this photo?")) return;
    setDeleting(id);
    await apiFetch(`/api/photographer/photos/${id}`, { method: "DELETE" });
    setDeleting(null);
    fetchPhotos(page);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-pixel text-2xl text-foreground">
          Photos {pagination && <span className="text-muted-foreground text-base font-normal">({pagination.total} total)</span>}
        </h1>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground">Loading...</div>
      ) : photos.length === 0 ? (
        <div className="border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">No photos found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {photos.map((photo) => (
              <div key={photo._id} className="group relative border border-border bg-card overflow-hidden">
                <div className="aspect-square relative">
                  <Image
                    src={photo.imageUrl}
                    alt={photo.originalFilename}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                  {!photo.isProcessed && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-xs text-center px-1">
                        {photo.processingError ? "Error" : "Processing..."}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-xs text-muted-foreground truncate">{photo.originalFilename}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-foreground">{photo.faceCount} faces</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                      onClick={() => deletePhoto(photo._id)}
                      disabled={deleting === photo._id}
                    >
                      {deleting === photo._id ? "..." : "Del"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
                Previous
              </Button>
              <span className="text-muted-foreground text-sm">Page {page} of {pagination.pages}</span>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page === pagination.pages}>
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
