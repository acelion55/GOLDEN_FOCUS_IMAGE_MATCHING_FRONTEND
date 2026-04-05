"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { apiFetch } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

interface PhotographerDetail {
  _id: string;
  name: string;
  email: string;
  businessName?: string;
  phone?: string;
  status: string;
  uniqueLink: string;
  createdAt: string;
  stats: { photoCount: number; visitCount: number; searchCount: number; matchCount: number; downloadCount: number };
  events: { _id: string; name: string; photoCount: number; createdAt: string }[];
  recentPhotos: { _id: string; imageUrl: string; originalFilename: string; isProcessed: boolean }[];
}

export default function PhotographerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [photographer, setPhotographer] = useState<PhotographerDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    apiFetch(`/api/admin/photographers/${id}`)
      .then((r) => r.json())
      .then((d) => setPhotographer(d.photographer))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [id]);

  const updateStatus = async (status: string) => {
    setActionLoading(true);
    const res = await apiFetch(`/api/admin/photographers/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.photographer) setPhotographer((p) => p ? { ...p, status: data.photographer.status } : p);
    setActionLoading(false);
  };

  const deletePhotographer = async () => {
    if (!confirm("Delete this photographer and ALL their data?")) return;
    setActionLoading(true);
    await apiFetch(`/api/admin/photographers/${id}`, { method: "DELETE" });
    router.push("/admin/photographers");
  };

  if (isLoading) return <div className="text-muted-foreground py-12 text-center">Loading...</div>;
  if (!photographer) return <div className="text-muted-foreground py-12 text-center">Photographer not found</div>;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/photographers">
          <Button variant="ghost" size="sm">← Back</Button>
        </Link>
        <h1 className="font-pixel text-2xl text-foreground">{photographer.name}</h1>
        <StatusBadge status={photographer.status} />
      </div>

      {/* Info + Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="border border-border bg-card p-6 lg:col-span-2">
          <h2 className="font-pixel text-lg text-foreground mb-4">Details</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-muted-foreground">Email</p><p className="text-foreground">{photographer.email}</p></div>
            <div><p className="text-muted-foreground">Business</p><p className="text-foreground">{photographer.businessName || "—"}</p></div>
            <div><p className="text-muted-foreground">Phone</p><p className="text-foreground">{photographer.phone || "—"}</p></div>
            <div><p className="text-muted-foreground">Joined</p><p className="text-foreground">{new Date(photographer.createdAt).toLocaleDateString()}</p></div>
            <div className="col-span-2"><p className="text-muted-foreground">Share Link</p>
              <code className="text-foreground text-xs">/find/{photographer.uniqueLink}</code>
            </div>
          </div>
        </div>

        <div className="border border-border bg-card p-6">
          <h2 className="font-pixel text-lg text-foreground mb-4">Actions</h2>
          <div className="flex flex-col gap-3">
            {photographer.status !== "approved" && (
              <Button onClick={() => updateStatus("approved")} disabled={actionLoading}>Approve</Button>
            )}
            {photographer.status !== "suspended" && (
              <Button variant="outline" onClick={() => updateStatus("suspended")} disabled={actionLoading}>Suspend</Button>
            )}
            {photographer.status !== "pending" && (
              <Button variant="outline" onClick={() => updateStatus("pending")} disabled={actionLoading}>Set Pending</Button>
            )}
            <Button variant="ghost" className="text-destructive hover:text-destructive"
              onClick={deletePhotographer} disabled={actionLoading}>
              Delete Photographer
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Photos", value: photographer.stats.photoCount },
          { label: "Visits", value: photographer.stats.visitCount },
          { label: "Searches", value: photographer.stats.searchCount },
          { label: "Matches", value: photographer.stats.matchCount },
          { label: "Downloads", value: photographer.stats.downloadCount },
        ].map((s) => (
          <div key={s.label} className="border border-border bg-card p-4 text-center">
            <p className="font-pixel text-2xl text-primary">{s.value}</p>
            <p className="text-muted-foreground text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Events */}
      {photographer.events.length > 0 && (
        <div className="border border-border bg-card p-6">
          <h2 className="font-pixel text-lg text-foreground mb-4">Events</h2>
          <div className="flex flex-col gap-2">
            {photographer.events.map((e) => (
              <div key={e._id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <p className="text-foreground">{e.name}</p>
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground text-sm">{e.photoCount} photos</span>
                  <span className="text-muted-foreground text-xs">{new Date(e.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Photos */}
      {photographer.recentPhotos.length > 0 && (
        <div className="border border-border bg-card p-6">
          <h2 className="font-pixel text-lg text-foreground mb-4">Recent Photos</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-2">
            {photographer.recentPhotos.map((photo) => (
              <div key={photo._id} className="aspect-square relative border border-border overflow-hidden">
                <Image src={photo.imageUrl} alt={photo.originalFilename} fill className="object-cover" sizes="10vw" />
                {!photo.isProcessed && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-xs">...</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-primary/20 text-primary",
    approved: "bg-green-500/20 text-green-400",
    suspended: "bg-destructive/20 text-destructive",
  };
  return <span className={`px-2 py-1 text-xs ${colors[status] || colors.pending}`}>{status}</span>;
}
