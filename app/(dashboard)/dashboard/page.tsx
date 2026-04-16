"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
  status: string;
}

interface User {
  name: string;
  businessName?: string;
  uniqueLink: string;
  email: string;
}

export default function PhotographerDashboardPage() {
  const [user] = useState<User>({
    name: "John Smith",
    businessName: "Smith Photography Studio",
    uniqueLink: "smith-photography-2024",
    email: "john@smithphoto.com"
  });
  
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    setTimeout(() => {
      setStats({
        photos: { total: 15678, processed: 15234, pending: 444 },
        events: 23,
        analytics: { visits: 2341, uniqueVisitors: 1987, searches: 1654, matches: 1432, downloads: 1298 }
      });
      
      setRecentEvents([
        { _id: "1", name: "Sarah & Mike Wedding", photoCount: 456, createdAt: "2024-01-15", status: "processed" },
        { _id: "2", name: "Corporate Holiday Party", photoCount: 234, createdAt: "2024-01-12", status: "processing" },
        { _id: "3", name: "Johnson Family Reunion", photoCount: 189, createdAt: "2024-01-10", status: "processed" },
        { _id: "4", name: "Tech Conference 2024", photoCount: 567, createdAt: "2024-01-08", status: "processed" },
        { _id: "5", name: "Birthday Celebration", photoCount: 123, createdAt: "2024-01-05", status: "processed" }
      ]);
      
      setIsLoading(false);
    }, 1000);
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
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a3925d] mx-auto mb-4"></div>
          <p className="text-white/60 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Mobile Header */}
      <div className="lg:hidden bg-[#1a1a1a] border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">{user?.name}</h1>
            <p className="text-white/60 text-sm">{user?.businessName}</p>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-white/60 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#1a1a1a] border-r border-white/10 transition-transform duration-300 ease-in-out`}>
          <div className="p-6">
            <div className="mb-8 hidden lg:block">
              <h2 className="text-xl font-bold text-[#a3925d] mb-1">{user?.name}</h2>
              <p className="text-white/60 text-sm">{user?.businessName}</p>
            </div>
            
            <nav className="space-y-2">
              <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-white bg-[#a3925d]/20 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
                Dashboard
              </Link>
              
              <Link href="/dashboard/upload" className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Photos
              </Link>
              
              <Link href="/dashboard/events" className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z" />
                </svg>
                Events
              </Link>
              
              <Link href="/dashboard/photos" className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v16a2 2 0 002 2z" />
                </svg>
                Photos
              </Link>
            </nav>
          </div>
        </div>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
              <div className="hidden lg:block">
                <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name}!</h1>
                <p className="text-white/60">Manage your photography business with AI-powered tools</p>
              </div>
              <Link href="/dashboard/upload">
                <button className="px-6 py-3 bg-[#a3925d] text-white rounded-lg hover:bg-[#b8a76b] transition-colors font-medium flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Photos
                </button>
              </Link>
            </div>

            {/* Share Link */}
            <div className="bg-[#1a1a1a] border border-[#a3925d]/30 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold text-[#a3925d] mb-2 flex items-center gap-2">
                <span className="text-2xl">🔗</span>
                Your Customer Share Link
              </h2>
              <p className="text-white/60 text-sm mb-4">
                Share this link with your customers so they can find their photos using face recognition.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-lg p-3">
                  <code className="text-white text-sm break-all">{shareLink}</code>
                </div>
                <button 
                  onClick={copyLink}
                  className="px-6 py-3 bg-[#a3925d] text-white rounded-lg hover:bg-[#b8a76b] transition-colors font-medium whitespace-nowrap"
                >
                  {copied ? "✓ Copied!" : "Copy Link"}
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
              <StatCard 
                title="Total Photos" 
                value={stats?.photos.total || 0} 
                subtitle={`${stats?.photos.processed || 0} processed`}
                icon="📸"
                trend="+12%"
              />
              <StatCard 
                title="Unique Visitors" 
                value={stats?.analytics.uniqueVisitors || 0} 
                subtitle="Customers via link"
                icon="👥"
                trend="+8%"
              />
              <StatCard 
                title="Face Matches" 
                value={stats?.analytics.matches || 0} 
                subtitle="Photos found"
                icon="🎯"
                trend="+15%"
              />
              <StatCard 
                title="Downloads" 
                value={stats?.analytics.downloads || 0} 
                subtitle="Photos downloaded"
                icon="⬇️"
                trend="+22%"
              />
            </div>

            {/* Processing Alert */}
            {stats && stats.photos.pending > 0 && (
              <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-4 mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⏳</span>
                  <div>
                    <p className="text-yellow-400 font-medium">
                      {stats.photos.pending} photos are being processed
                    </p>
                    <p className="text-white/60 text-sm">
                      Face recognition is in progress. This may take a few minutes.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Recent Events */}
              <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="text-2xl">📅</span>
                    Recent Events
                  </h2>
                  <Link href="/dashboard/events">
                    <button className="px-4 py-2 text-[#a3925d] hover:text-white transition-colors text-sm font-medium">
                      View All →
                    </button>
                  </Link>
                </div>
                
                {recentEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">📸</div>
                    <p className="text-white/60 mb-4">No events yet</p>
                    <Link href="/dashboard/upload">
                      <button className="px-4 py-2 border border-white/20 text-white/80 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium">
                        Upload Your First Photos
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentEvents.map((event) => (
                      <div key={event._id} className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-lg hover:bg-white/5 transition-colors">
                        <div className="flex-1">
                          <p className="text-white font-medium">{event.name}</p>
                          <p className="text-white/60 text-sm">{event.photoCount} photos</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusBadge status={event.status} />
                          <span className="text-white/40 text-xs whitespace-nowrap">
                            {new Date(event.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <Link href="/dashboard/upload" className="block">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#0a0a0a] hover:bg-white/5 rounded-lg transition-colors text-left">
                      <svg className="w-5 h-5 text-[#a3925d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <div>
                        <p className="text-white font-medium">Upload New Photos</p>
                        <p className="text-white/60 text-sm">Add photos to a new or existing event</p>
                      </div>
                    </button>
                  </Link>
                  
                  <Link href="/dashboard/photos" className="block">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#0a0a0a] hover:bg-white/5 rounded-lg transition-colors text-left">
                      <svg className="w-5 h-5 text-[#a3925d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v16a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-white font-medium">Manage Photos</p>
                        <p className="text-white/60 text-sm">View and organize your photo library</p>
                      </div>
                    </button>
                  </Link>
                  
                  <Link href="/dashboard/events" className="block">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#0a0a0a] hover:bg-white/5 rounded-lg transition-colors text-left">
                      <svg className="w-5 h-5 text-[#a3925d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-white font-medium">Manage Events</p>
                        <p className="text-white/60 text-sm">View all your events and analytics</p>
                      </div>
                    </button>
                  </Link>
                  
                  <button 
                    onClick={copyLink}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-[#0a0a0a] hover:bg-white/5 rounded-lg transition-colors text-left"
                  >
                    <svg className="w-5 h-5 text-[#a3925d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-white font-medium">{copied ? "✓ Link Copied!" : "Copy Customer Link"}</p>
                      <p className="text-white/60 text-sm">Share with your clients</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, trend }: { 
  title: string; 
  value: number; 
  subtitle: string; 
  icon: string;
  trend: string;
}) {
  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 hover:border-[#a3925d]/30 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        <span className="text-green-400 text-sm font-medium">{trend}</span>
      </div>
      <p className="text-white/60 text-sm mb-2">{title}</p>
      <p className="text-3xl font-bold text-[#a3925d] mb-1">{value.toLocaleString()}</p>
      <p className="text-white/40 text-xs">{subtitle}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    processed: "bg-green-400/20 text-green-400 border-green-400/30",
    processing: "bg-yellow-400/20 text-yellow-400 border-yellow-400/30",
    failed: "bg-red-400/20 text-red-400 border-red-400/30",
  };
  
  return (
    <span className={`px-3 py-1 text-xs rounded-full border font-medium ${styles[status as keyof typeof styles] || styles.processing}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}