"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

interface Photographer {
  _id: string;
  name: string;
  email: string;
  businessName?: string;
  phone?: string;
  status: "pending" | "approved" | "suspended";
  uniqueLink: string;
  createdAt: string;
  stats: { photoCount: number; visitCount: number; downloadCount: number };
  eventCount?: number;
}

export default function PhotographersPage() {
  const searchParams = useSearchParams();
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState(searchParams.get("status") || "");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPhotographers = useCallback(async (status: string) => {
    setIsLoading(true);
    const url = status ? `/api/admin/photographers?status=${status}` : "/api/admin/photographers";
    const res = await apiFetch(url);
    const data = await res.json();
    setPhotographers(data.photographers ?? []);
    setIsLoading(false);
  }, []);

  useEffect(() => { fetchPhotographers(filter); }, [filter, fetchPhotographers]);

  const updateStatus = async (id: string, status: string) => {
    setActionLoading(id);
    await apiFetch(`/api/admin/photographers/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
    setActionLoading(null);
    fetchPhotographers(filter);
  };

  const deletePhotographer = async (id: string) => {
    if (!confirm("Delete this photographer and ALL their data?")) return;
    setActionLoading(id);
    await apiFetch(`/api/admin/photographers/${id}`, { method: "DELETE" });
    setActionLoading(null);
    fetchPhotographers(filter);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-pixel text-2xl text-yellow-400">Photographers</h1>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {["", "pending", "approved", "suspended"].map((s) => (
          <button key={s || "all"}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${filter === s ? "bg-yellow-400 text-black border-yellow-400" : "border-white/20 text-white/50 hover:text-white hover:border-white/40"}`}>
            {s || "All"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-white/40 py-8 text-center">Loading...</div>
      ) : photographers.length === 0 ? (
        <div className="border border-white/10 bg-black/80 rounded-xl p-8 text-center">
          <p className="text-white/30">No photographers found</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {photographers.map((p) => (
            <div key={p._id} className="border border-white/10 bg-black/80 rounded-xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Info */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <p className="text-white font-medium">{p.name}</p>
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="text-white/40 text-sm">{p.email}</p>
                  {p.businessName && <p className="text-white/30 text-xs">{p.businessName}</p>}
                  {p.phone && <p className="text-white/30 text-xs">📞 {p.phone}</p>}
                  <p className="text-white/20 text-xs mt-1">Joined {new Date(p.createdAt).toLocaleDateString()}</p>
                </div>

                {/* Stats */}
                <div className="flex gap-6 text-center">
                  <div>
                    <p className="text-yellow-400 font-pixel text-lg">{p.eventCount ?? 0}</p>
                    <p className="text-white/30 text-xs">Events</p>
                  </div>
                  <div>
                    <p className="text-yellow-400 font-pixel text-lg">{p.stats.photoCount}</p>
                    <p className="text-white/30 text-xs">Photos</p>
                  </div>
                  <div>
                    <p className="text-yellow-400 font-pixel text-lg">{p.stats.visitCount}</p>
                    <p className="text-white/30 text-xs">Visits</p>
                  </div>
                  <div>
                    <p className="text-yellow-400 font-pixel text-lg">{p.stats.downloadCount}</p>
                    <p className="text-white/30 text-xs">Downloads</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4 flex-wrap">
                {p.status === "pending" && (
                  <button onClick={() => updateStatus(p._id, "approved")} disabled={actionLoading === p._id}
                    className="px-3 py-1.5 text-xs bg-green-500/20 text-green-400 border border-green-500/30 rounded hover:bg-green-500/30 transition-colors disabled:opacity-50">
                    ✓ Approve
                  </button>
                )}
                {p.status === "approved" && (
                  <button onClick={() => updateStatus(p._id, "suspended")} disabled={actionLoading === p._id}
                    className="px-3 py-1.5 text-xs bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 rounded hover:bg-yellow-400/20 transition-colors disabled:opacity-50">
                    Suspend
                  </button>
                )}
                {p.status === "suspended" && (
                  <button onClick={() => updateStatus(p._id, "approved")} disabled={actionLoading === p._id}
                    className="px-3 py-1.5 text-xs bg-green-500/20 text-green-400 border border-green-500/30 rounded hover:bg-green-500/30 transition-colors disabled:opacity-50">
                    Reactivate
                  </button>
                )}
                <Link href={`/admin/photographers/${p._id}`}>
                  <button className="px-3 py-1.5 text-xs bg-white/5 text-white/60 border border-white/10 rounded hover:bg-white/10 transition-colors">
                    View Details
                  </button>
                </Link>
                <Link href={`/admin/events?photographer=${p._id}`}>
                  <button className="px-3 py-1.5 text-xs bg-white/5 text-white/60 border border-white/10 rounded hover:bg-white/10 transition-colors">
                    View Events
                  </button>
                </Link>
                <button onClick={() => deletePhotographer(p._id)} disabled={actionLoading === p._id}
                  className="px-3 py-1.5 text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded hover:bg-red-500/20 transition-colors disabled:opacity-50">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-400/20 text-yellow-400",
    approved: "bg-green-500/20 text-green-400",
    suspended: "bg-red-500/20 text-red-400",
  };
  return <span className={`px-2 py-0.5 text-xs rounded ${colors[status] || colors.pending}`}>{status}</span>;
}
