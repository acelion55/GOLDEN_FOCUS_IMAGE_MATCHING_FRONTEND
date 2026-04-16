"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Photographer {
  _id: string;
  name: string;
  email: string;
  businessName?: string;
  status: "pending" | "approved" | "suspended";
  createdAt: string;
  stats: {
    eventCount: number;
    photoCount: number;
    visitCount: number;
    downloadCount: number;
  };
}

export default function AdminPhotographersPage() {
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock data
  useEffect(() => {
    setTimeout(() => {
      setPhotographers([
        {
          _id: "1",
          name: "Sarah Johnson",
          email: "sarah@example.com",
          businessName: "Sarah's Photography",
          status: "pending",
          createdAt: "2024-01-15",
          stats: { eventCount: 0, photoCount: 0, visitCount: 0, downloadCount: 0 }
        },
        {
          _id: "2",
          name: "Mike Chen",
          email: "mike@example.com",
          businessName: "Chen Studios",
          status: "approved",
          createdAt: "2024-01-10",
          stats: { eventCount: 15, photoCount: 2341, visitCount: 1987, downloadCount: 1432 }
        },
        {
          _id: "3",
          name: "Emily Davis",
          email: "emily@example.com",
          status: "approved",
          createdAt: "2024-01-08",
          stats: { eventCount: 23, photoCount: 3456, visitCount: 2876, downloadCount: 2134 }
        },
        {
          _id: "4",
          name: "Alex Rodriguez",
          email: "alex@example.com",
          businessName: "Rodriguez Photography",
          status: "suspended",
          createdAt: "2024-01-05",
          stats: { eventCount: 8, photoCount: 987, visitCount: 543, downloadCount: 234 }
        },
        {
          _id: "5",
          name: "Lisa Wang",
          email: "lisa@example.com",
          businessName: "Wang Photography",
          status: "approved",
          createdAt: "2024-01-03",
          stats: { eventCount: 31, photoCount: 4567, visitCount: 3421, downloadCount: 2987 }
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredPhotographers = photographers.filter(photographer => {
    const matchesFilter = filter === "all" || photographer.status === filter;
    const matchesSearch = photographer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photographer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (photographer.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    return matchesFilter && matchesSearch;
  });

  const handleStatusChange = (photographerId: string, newStatus: "approved" | "suspended") => {
    setPhotographers(prev => 
      prev.map(p => p._id === photographerId ? { ...p, status: newStatus } : p)
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a3925d] mx-auto mb-4"></div>
          <p className="text-white/60 text-lg">Loading photographers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Mobile Header */}
      <div className="lg:hidden bg-[#1a1a1a] border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#a3925d]">Photographers</h1>
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
              <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
                Dashboard
              </Link>
              
              <Link href="/admin/photographers" className="flex items-center gap-3 px-4 py-3 text-white bg-[#a3925d]/20 rounded-lg">
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
              <h1 className="text-3xl font-bold text-white mb-2">Photographers Management</h1>
              <p className="text-white/60">Manage photographer accounts and approvals</p>
            </div>

            {/* Filters and Search */}
            <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search photographers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-[#a3925d] focus:outline-none"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {["all", "pending", "approved", "suspended"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={`px-4 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
                        filter === status
                          ? "bg-[#a3925d] text-white"
                          : "bg-[#0a0a0a] text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Photographers List */}
            <div className="bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden">
              {/* Desktop Table Header */}
              <div className="hidden lg:grid lg:grid-cols-12 gap-4 p-6 border-b border-white/10 bg-[#0a0a0a]">
                <div className="col-span-3 text-white/60 text-sm font-medium">Photographer</div>
                <div className="col-span-2 text-white/60 text-sm font-medium">Status</div>
                <div className="col-span-2 text-white/60 text-sm font-medium">Events</div>
                <div className="col-span-2 text-white/60 text-sm font-medium">Photos</div>
                <div className="col-span-2 text-white/60 text-sm font-medium">Joined</div>
                <div className="col-span-1 text-white/60 text-sm font-medium">Actions</div>
              </div>

              {/* Photographers */}
              <div className="divide-y divide-white/10">
                {filteredPhotographers.map((photographer) => (
                  <div key={photographer._id} className="p-6">
                    {/* Mobile Layout */}
                    <div className="lg:hidden space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-white font-medium">{photographer.name}</h3>
                          <p className="text-white/60 text-sm">{photographer.email}</p>
                          {photographer.businessName && (
                            <p className="text-white/40 text-xs">{photographer.businessName}</p>
                          )}
                        </div>
                        <StatusBadge status={photographer.status} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-white/60">Events: </span>
                          <span className="text-white">{photographer.stats.eventCount}</span>
                        </div>
                        <div>
                          <span className="text-white/60">Photos: </span>
                          <span className="text-white">{photographer.stats.photoCount.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-white/60">Visits: </span>
                          <span className="text-white">{photographer.stats.visitCount.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-white/60">Joined: </span>
                          <span className="text-white">{new Date(photographer.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      {photographer.status === "pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStatusChange(photographer._id, "approved")}
                            className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(photographer._id, "suspended")}
                            className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-center">
                      <div className="col-span-3">
                        <h3 className="text-white font-medium">{photographer.name}</h3>
                        <p className="text-white/60 text-sm">{photographer.email}</p>
                        {photographer.businessName && (
                          <p className="text-white/40 text-xs">{photographer.businessName}</p>
                        )}
                      </div>
                      
                      <div className="col-span-2">
                        <StatusBadge status={photographer.status} />
                      </div>
                      
                      <div className="col-span-2">
                        <span className="text-white">{photographer.stats.eventCount}</span>
                      </div>
                      
                      <div className="col-span-2">
                        <span className="text-white">{photographer.stats.photoCount.toLocaleString()}</span>
                      </div>
                      
                      <div className="col-span-2">
                        <span className="text-white/60 text-sm">
                          {new Date(photographer.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="col-span-1">
                        {photographer.status === "pending" && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleStatusChange(photographer._id, "approved")}
                              className="p-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                              title="Approve"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => handleStatusChange(photographer._id, "suspended")}
                              className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                              title="Reject"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredPhotographers.length === 0 && (
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4">👥</div>
                  <p className="text-white/60 mb-2">No photographers found</p>
                  <p className="text-white/40 text-sm">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
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