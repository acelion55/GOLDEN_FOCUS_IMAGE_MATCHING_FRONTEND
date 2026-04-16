"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    setTimeout(() => {
      setStats({
        photographers: { total: 1247, pending: 23, approved: 1198, suspended: 26 },
        photos: { total: 2847392, processed: 2834521, pending: 12871 },
        analytics: { totalVisits: 89432, totalDownloads: 234567, totalSearches: 156789, totalMatches: 145623 }
      });
      
      setRecentSignups([
        { _id: "1", name: "Sarah Johnson", email: "sarah@example.com", businessName: "Sarah's Photography", status: "pending", createdAt: "2024-01-15" },
        { _id: "2", name: "Mike Chen", email: "mike@example.com", status: "approved", createdAt: "2024-01-14" },
        { _id: "3", name: "Emily Davis", email: "emily@example.com", businessName: "Davis Studios", status: "pending", createdAt: "2024-01-13" },
        { _id: "4", name: "Alex Rodriguez", email: "alex@example.com", status: "approved", createdAt: "2024-01-12" },
        { _id: "5", name: "Lisa Wang", email: "lisa@example.com", businessName: "Wang Photography", status: "suspended", createdAt: "2024-01-11" }
      ]);
      
      setTopPhotographers([
        { _id: "1", name: "John Smith", businessName: "Smith Studios", stats: { visitCount: 2341, photoCount: 15678, downloadCount: 8934 } },
        { _id: "2", name: "Maria Garcia", businessName: "Garcia Photography", stats: { visitCount: 1987, photoCount: 12456, downloadCount: 7234 } },
        { _id: "3", name: "David Wilson", stats: { visitCount: 1654, photoCount: 9876, downloadCount: 5432 } },
        { _id: "4", name: "Jennifer Brown", businessName: "Brown Events", stats: { visitCount: 1432, photoCount: 8765, downloadCount: 4321 } },
        { _id: "5", name: "Robert Taylor", stats: { visitCount: 1298, photoCount: 7654, downloadCount: 3987 } }
      ]);
      
      setIsLoading(false);
    }, 1000);
  }, []);

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
          <h1 className="text-xl font-bold text-[#a3925d]">Admin Dashboard</h1>
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
            <h2 className="text-2xl font-bold text-[#a3925d] mb-8 hidden lg:block">Admin Panel</h2>
            
            <nav className="space-y-2">
              <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-white bg-[#a3925d]/20 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
                Dashboard
              </Link>
              
              <Link href="/admin/photographers" className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
                Photographers
              </Link>
              
              <Link href="/admin/events" className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z" />
                </svg>
                Events
              </Link>
              
              <Link href="/admin/photos" className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
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
            <div className="mb-8 hidden lg:block">
              <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-white/60">Monitor and manage your photography platform</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
              <StatCard 
                title="Total Photographers" 
                value={stats?.photographers.total ?? 0} 
                sub={`${stats?.photographers.pending ?? 0} pending approval`}
                icon="👥"
                trend="+12%"
              />
              <StatCard 
                title="Total Photos" 
                value={stats?.photos.total ?? 0} 
                sub={`${stats?.photos.processed ?? 0} processed`}
                icon="📸"
                trend="+8%"
              />
              <StatCard 
                title="Total Visits" 
                value={stats?.analytics.totalVisits ?? 0} 
                sub="Customer page views"
                icon="👁️"
                trend="+15%"
              />
              <StatCard 
                title="Face Searches" 
                value={stats?.analytics.totalSearches ?? 0} 
                sub={`${stats?.analytics.totalMatches ?? 0} matches found`}
                icon="🔍"
                trend="+22%"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Photographer Status */}
              <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  Photographer Status
                </h2>
                <div className="space-y-4">
                  <StatusRow 
                    label="Pending Approval" 
                    value={stats?.photographers.pending ?? 0} 
                    color="text-yellow-400"
                    bgColor="bg-yellow-400/10"
                  />
                  <StatusRow 
                    label="Approved & Active" 
                    value={stats?.photographers.approved ?? 0} 
                    color="text-green-400"
                    bgColor="bg-green-400/10"
                  />
                  <StatusRow 
                    label="Suspended" 
                    value={stats?.photographers.suspended ?? 0} 
                    color="text-red-400"
                    bgColor="bg-red-400/10"
                  />
                </div>
                <Link href="/admin/photographers?status=pending" className="block mt-6">
                  <button className="w-full px-4 py-3 bg-[#a3925d] text-white rounded-lg hover:bg-[#b8a76b] transition-colors font-medium">
                    Review Pending Applications
                  </button>
                </Link>
              </div>

              {/* Platform Activity */}
              <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  Platform Activity
                </h2>
                <div className="space-y-4">
                  <ActivityRow 
                    label="Total Downloads" 
                    value={stats?.analytics.totalDownloads ?? 0}
                    icon="⬇️"
                  />
                  <ActivityRow 
                    label="Photos Processing" 
                    value={stats?.photos.pending ?? 0}
                    icon="⏳"
                  />
                  <ActivityRow 
                    label="Successful Matches" 
                    value={stats?.analytics.totalMatches ?? 0}
                    icon="✅"
                  />
                </div>
                <Link href="/admin/events" className="block mt-6">
                  <button className="w-full px-4 py-3 border border-white/20 text-white/80 rounded-lg hover:bg-white/5 transition-colors font-medium">
                    View All Events
                  </button>
                </Link>
              </div>
            </div>

            {/* Top Photographers */}
            <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-2xl">🏆</span>
                  Top Photographers by Traffic
                </h2>
                <Link href="/admin/photographers">
                  <button className="px-4 py-2 text-[#a3925d] hover:text-white transition-colors text-sm font-medium">
                    View All →
                  </button>
                </Link>
              </div>
              
              <div className="space-y-3">
                {topPhotographers.map((photographer, index) => (
                  <div key={photographer._id} className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-lg hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-[#a3925d] font-bold text-lg w-8">#{index + 1}</span>
                      <div>
                        <p className="text-white font-medium">{photographer.name}</p>
                        {photographer.businessName && (
                          <p className="text-white/60 text-sm">{photographer.businessName}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-xs text-white/60">
                      <span className="flex items-center gap-1">
                        <span className="text-white font-medium">{photographer.stats.visitCount.toLocaleString()}</span> visits
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="text-white font-medium">{photographer.stats.photoCount.toLocaleString()}</span> photos
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="text-white font-medium">{photographer.stats.downloadCount.toLocaleString()}</span> downloads
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Signups */}
            <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-2xl">👋</span>
                  Recent Signups
                </h2>
                <Link href="/admin/photographers">
                  <button className="px-4 py-2 text-[#a3925d] hover:text-white transition-colors text-sm font-medium">
                    View All →
                  </button>
                </Link>
              </div>
              
              <div className="space-y-3">
                {recentSignups.map((signup) => (
                  <div key={signup._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#0a0a0a] rounded-lg gap-4">
                    <div className="flex-1">
                      <p className="text-white font-medium">{signup.name}</p>
                      <p className="text-white/60 text-sm">{signup.email}</p>
                      {signup.businessName && (
                        <p className="text-white/40 text-xs mt-1">{signup.businessName}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={signup.status} />
                      <span className="text-white/40 text-xs whitespace-nowrap">
                        {new Date(signup.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, sub, icon, trend }: { 
  title: string; 
  value: number; 
  sub: string; 
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
      <p className="text-white/40 text-xs">{sub}</p>
    </div>
  );
}

function StatusRow({ label, value, color, bgColor }: { 
  label: string; 
  value: number; 
  color: string;
  bgColor: string;
}) {
  return (
    <div className={`flex items-center justify-between p-3 ${bgColor} rounded-lg`}>
      <span className="text-white/80 text-sm">{label}</span>
      <span className={`font-bold text-lg ${color}`}>{value}</span>
    </div>
  );
}

function ActivityRow({ label, value, icon }: { 
  label: string; 
  value: number; 
  icon: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-lg">
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span className="text-white/80 text-sm">{label}</span>
      </div>
      <span className="font-bold text-white">{value.toLocaleString()}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    pending: "bg-yellow-400/20 text-yellow-400 border-yellow-400/30",
    approved: "bg-green-400/20 text-green-400 border-green-400/30",
    suspended: "bg-red-400/20 text-red-400 border-red-400/30",
  };
  
  return (
    <span className={`px-3 py-1 text-xs rounded-full border font-medium ${styles[status as keyof typeof styles] || styles.pending}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}