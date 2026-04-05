"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

interface Stats {
  photographers: { total: number; pending: number; approved: number; suspended: number };
  photos: { total: number; processed: number; pending: number };
  analytics: { totalVisits: number; totalDownloads: number; totalSearches: number; totalMatches: number };
}

interface RecentSignup {
  _id: string;
  name: string;
  email: string;
  businessName?: string;
  status: string;
  createdAt: string;
}

interface TopPhotographer {
  _id: string;
  name: string;
  businessName?: string;
  stats: { visitCount: number; photoCount: number; downloadCount: number };
  eventCount?: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentSignups, setRecentSignups] = useState<RecentSignup[]>([]);
  const [topPhotographers, setTopPhotographers] = useState<TopPhotographer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch("/api/admin/stats").then((r) => r.json()),
      apiFetch("/api/admin/photographers?limit=5&sort=visits").then((r) => r.json()),
    ])
      .then(([statsData, photogsData]) => {
        setStats(statsData.stats ?? null);
        setRecentSignups(statsData.recentSignups ?? []);
        setTopPhotographers(photogsData.photographers ?? []);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center py-20 text-white/40">Loading dashboard...</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-pixel text-2xl text-yellow-400">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Photographers" value={stats?.photographers.total ?? 0} sub={`${stats?.photographers.pending ?? 0} pending`} />
        <StatCard title="Total Photos" value={stats?.photos.total ?? 0} sub={`${stats?.photos.processed ?? 0} processed`} />
        <StatCard title="Total Visits" value={stats?.analytics.totalVisits ?? 0} sub="Customer page views" />
        <StatCard title="Face Searches" value={stats?.analytics.totalSearches ?? 0} sub={`${stats?.analytics.totalMatches ?? 0} matches`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Photographer Status */}
        <div className="border border-white/10 bg-black/80 rounded-xl p-6">
          <h2 className="font-pixel text-base text-white mb-4">Photographer Status</h2>
          <div className="flex flex-col gap-3">
            <Row label="Pending Approval" value={stats?.photographers.pending ?? 0} color="text-yellow-400" />
            <Row label="Approved" value={stats?.photographers.approved ?? 0} color="text-green-400" />
            <Row label="Suspended" value={stats?.photographers.suspended ?? 0} color="text-red-400" />
          </div>
          <Link href="/admin/photographers?status=pending" className="block mt-4">
            <Button variant="outline" size="sm" className="w-full border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10">
              Review Pending
            </Button>
          </Link>
        </div>

        {/* Platform Activity */}
        <div className="border border-white/10 bg-black/80 rounded-xl p-6">
          <h2 className="font-pixel text-base text-white mb-4">Platform Activity</h2>
          <div className="flex flex-col gap-3">
            <Row label="Total Downloads" value={stats?.analytics.totalDownloads ?? 0} />
            <Row label="Photos Pending Processing" value={stats?.photos.pending ?? 0} />
            <Row label="Matches Found" value={stats?.analytics.totalMatches ?? 0} />
          </div>
          <Link href="/admin/events" className="block mt-4">
            <Button variant="outline" size="sm" className="w-full border-white/20 text-white/60 hover:bg-white/5">
              View All Events
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Photographers by Traffic */}
      <div className="border border-white/10 bg-black/80 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-pixel text-base text-white">Top Photographers by Traffic</h2>
          <Link href="/admin/photographers"><Button variant="ghost" size="sm" className="text-white/50 hover:text-white">View All</Button></Link>
        </div>
        {topPhotographers.length === 0 ? (
          <p className="text-white/30 text-sm">No data yet</p>
        ) : (
          <div className="flex flex-col gap-2">
            {topPhotographers.map((p, i) => (
              <div key={p._id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-yellow-400 font-pixel text-sm w-6">#{i + 1}</span>
                  <div>
                    <p className="text-white text-sm">{p.name}</p>
                    {p.businessName && <p className="text-white/40 text-xs">{p.businessName}</p>}
                  </div>
                </div>
                <div className="flex gap-6 text-xs text-white/50">
                  <span><span className="text-white">{p.stats.visitCount}</span> visits</span>
                  <span><span className="text-white">{p.stats.photoCount}</span> photos</span>
                  <span><span className="text-white">{p.stats.downloadCount}</span> dl</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Signups */}
      <div className="border border-white/10 bg-black/80 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-pixel text-base text-white">Recent Signups</h2>
          <Link href="/admin/photographers"><Button variant="ghost" size="sm" className="text-white/50 hover:text-white">View All</Button></Link>
        </div>
        {recentSignups.length === 0 ? (
          <p className="text-white/30 text-sm">No recent signups</p>
        ) : (
          <div className="flex flex-col gap-2">
            {recentSignups.map((s) => (
              <div key={s._id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-white text-sm">{s.name}</p>
                  <p className="text-white/40 text-xs">{s.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={s.status} />
                  <span className="text-white/30 text-xs">{new Date(s.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, color = "text-white" }: { label: string; value: number; color?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/50 text-sm">{label}</span>
      <span className={`font-medium ${color}`}>{value}</span>
    </div>
  );
}

function StatCard({ title, value, sub }: { title: string; value: number; sub: string }) {
  return (
    <div className="border border-white/10 bg-black/80 rounded-xl p-5">
      <p className="text-white/40 text-xs mb-1">{title}</p>
      <p className="font-pixel text-3xl text-yellow-400 mb-1">{value}</p>
      <p className="text-white/30 text-xs">{sub}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-400/20 text-yellow-400",
    approved: "bg-green-500/20 text-green-400",
    suspended: "bg-red-500/20 text-red-400",
  };
  return <span className={`px-2 py-1 text-xs rounded ${colors[status] || colors.pending}`}>{status}</span>;
}
