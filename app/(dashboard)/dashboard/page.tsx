"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth, apiFetch } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface Stats {
  photos: { total: number; processed: number; pending: number };
  events: number;
  analytics: { visits: number; uniqueVisitors: number; searches: number; matches: number; downloads: number };
}

interface RecentEvent {
  _id: string;
  name: string;
  photoCount: number;
  createdAt: string;
}

export default function PhotographerDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    apiFetch("/api/photographer/stats")
      .then((r) => r.json())
      .then((d) => { setStats(d.stats); setRecentEvents(d.recentEvents); })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const shareLink = user?.uniqueLink
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/find/${user.uniqueLink}`
    : "";

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-12 text-muted-foreground">Loading dashboard...</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-pixel text-2xl text-foreground">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground text-sm mt-1">{user?.businessName || "Photographer Dashboard"}</p>
        </div>
        <Link href="/dashboard/upload">
          <Button>Upload Photos</Button>
        </Link>
      </div>

      {/* Share Link */}
      <div className="border border-primary bg-primary/5 p-6">
        <h2 className="font-pixel text-lg text-primary mb-2">Your Customer Share Link</h2>
        <p className="text-muted-foreground text-sm mb-4">
          Share this link with your customers so they can find their photos using face recognition.
        </p>
        <div className="flex gap-2 items-center flex-wrap">
          <code className="bg-background border border-border px-3 py-2 text-sm text-foreground flex-1 min-w-0 truncate">
            {shareLink}
          </code>
          <Button onClick={copyLink} variant="outline">{copied ? "Copied!" : "Copy Link"}</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Photos" value={stats?.photos.total || 0} subtitle={`${stats?.photos.processed || 0} processed`} />
        <StatCard title="Unique Visitors" value={stats?.analytics.uniqueVisitors || 0} subtitle="Customers via link" />
        <StatCard title="Face Matches" value={stats?.analytics.matches || 0} subtitle="Photos found" />
        <StatCard title="Downloads" value={stats?.analytics.downloads || 0} subtitle="Photos downloaded" />
      </div>

      {/* Recent Events + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-pixel text-lg text-foreground">Recent Events</h2>
            <Link href="/dashboard/events">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          {recentEvents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No events yet</p>
              <Link href="/dashboard/upload">
                <Button variant="outline" size="sm">Upload Your First Photos</Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {recentEvents.map((event) => (
                <div key={event._id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-foreground">{event.name}</p>
                    <p className="text-muted-foreground text-sm">{event.photoCount} photos</p>
                  </div>
                  <span className="text-muted-foreground text-xs">{new Date(event.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border border-border bg-card p-6">
          <h2 className="font-pixel text-lg text-foreground mb-4">Quick Actions</h2>
          <div className="flex flex-col gap-3">
            <Link href="/dashboard/upload" className="block">
              <Button variant="outline" className="w-full justify-start">Upload New Photos</Button>
            </Link>
            <Link href="/dashboard/photos" className="block">
              <Button variant="outline" className="w-full justify-start">Manage Photos</Button>
            </Link>
            <Link href="/dashboard/events" className="block">
              <Button variant="outline" className="w-full justify-start">Manage Events</Button>
            </Link>
            <Button variant="outline" className="w-full justify-start" onClick={copyLink}>
              {copied ? "Link Copied!" : "Copy Customer Link"}
            </Button>
          </div>
        </div>
      </div>

      {stats && stats.photos.pending > 0 && (
        <div className="border border-primary/50 bg-primary/5 p-4">
          <p className="text-foreground text-sm">
            <span className="font-medium">{stats.photos.pending}</span> photos are still being processed for face recognition. This may take a few minutes.
          </p>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, subtitle }: { title: string; value: number; subtitle: string }) {
  return (
    <div className="border border-border bg-card p-4">
      <p className="text-muted-foreground text-sm mb-1">{title}</p>
      <p className="font-pixel text-2xl text-primary mb-1">{value}</p>
      <p className="text-muted-foreground text-xs">{subtitle}</p>
    </div>
  );
}
