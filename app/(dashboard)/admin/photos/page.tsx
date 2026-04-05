"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiFetch } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

interface Photo {
  _id: string;
  imageUrl: string;
  originalFilename: string;
  eventName: string;
  isProcessed: boolean;
  faceCount: number;
  downloadCount: number;
  photographerId: { _id: string; name: string; email: string };
  createdAt: string;
}

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [pagination, setPagination] = useState<{ page: number; total: number; pages: number } | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPhotos = useCallback(async (p: number) => {
    setIsLoading(true);
    const res = await apiFetch(`/api/admin/photos?page=${p}&limit=30`);
    const data = await res.json();
    setPhotos(data.photos || []);
    setPagination(data.pagination);
    setIsLoading(false);
  }, []);

  useEffect(() => { fetchPhotos(page); }, [page, fetchPhotos]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-pixel text-2xl text-foreground">
          All Photos {pagination && <span className="text-muted-foreground text-base font-normal">({pagination.total} total)</span>}
        </h1>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground">Loading...</div>
      ) : photos.length === 0 ? (
        <div className="border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">No photos uploaded yet</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {photos.map((photo) => (
              <div key={photo._id} className="border border-border bg-card overflow-hidden">
                <div className="aspect-square relative">
                  <Image src={photo.imageUrl} alt={photo.originalFilename} fill className="object-cover" sizes="16vw" />
                  {!photo.isProcessed && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-xs">Processing</span>
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-xs text-foreground truncate">{photo.eventName}</p>
                  <Link href={`/admin/photographers/${photo.photographerId?._id}`}>
                    <p className="text-xs text-primary hover:underline truncate">{photo.photographerId?.name}</p>
                  </Link>
                  <p className="text-xs text-muted-foreground">{photo.faceCount} faces · {photo.downloadCount} dl</p>
                </div>
              </div>
            ))}
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>Previous</Button>
              <span className="text-muted-foreground text-sm">Page {page} of {pagination.pages}</span>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page === pagination.pages}>Next</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
