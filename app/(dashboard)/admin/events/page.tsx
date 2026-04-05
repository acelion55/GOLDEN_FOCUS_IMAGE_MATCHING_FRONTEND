"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/auth-context";

interface Event {
  _id: string;
  name: string;
  date?: string;
  location?: string;
  photoCount: number;
  visitCount: number;
  downloadCount: number;
  uniqueVisitors?: number;
  photographer: { _id: string; name: string; businessName?: string };
  createdAt: string;
  uniqueLink?: string;
}

export default function AdminEventsPage() {
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [photographerFilter, setPhotographerFilter] = useState(searchParams.get("photographer") || "");

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    const url = photographerFilter
      ? `/api/admin/events?photographer=${photographerFilter}`
      : "/api/admin/events";
    try {
      const res = await apiFetch(url);
      const data = await res.json();
      setEvents(data.events ?? []);
    } catch {
      setEvents([]);
    }
    setIsLoading(false);
  }, [photographerFilter]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-pixel text-2xl text-yellow-400">
          All Events
          {photographerFilter && <span className="text-white/30 text-sm font-normal ml-3">filtered by photographer</span>}
        </h1>
        {photographerFilter && (
          <button onClick={() => setPhotographerFilter("")}
            className="text-xs text-white/40 hover:text-white border border-white/10 px-3 py-1.5 rounded transition-colors">
            Clear Filter
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="text-white/40 py-8 text-center">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="border border-white/10 bg-black/80 rounded-xl p-8 text-center">
          <p className="text-white/30">No events found</p>
          <p className="text-white/20 text-xs mt-2">Events are created by photographers from their dashboard</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {events.map((event) => (
            <div key={event._id} className="border border-white/10 bg-black/80 rounded-xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Event Info */}
                <div className="flex flex-col gap-1">
                  <p className="text-white font-medium text-base">{event.name}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link href={`/admin/photographers/${event.photographer._id}`}
                      className="text-yellow-400 text-sm hover:underline">
                      {event.photographer.name}
                    </Link>
                    {event.photographer.businessName && (
                      <span className="text-white/30 text-xs">· {event.photographer.businessName}</span>
                    )}
                  </div>
                  {event.date && <p className="text-white/30 text-xs">📅 {new Date(event.date).toLocaleDateString()}</p>}
                  {event.location && <p className="text-white/30 text-xs">📍 {event.location}</p>}
                  <p className="text-white/20 text-xs">Created {new Date(event.createdAt).toLocaleDateString()}</p>
                </div>

                {/* Event Stats */}
                <div className="flex gap-5 text-center shrink-0">
                  <div>
                    <p className="text-yellow-400 font-pixel text-xl">{event.photoCount}</p>
                    <p className="text-white/30 text-xs">Photos</p>
                  </div>
                  <div>
                    <p className="text-yellow-400 font-pixel text-xl">{event.visitCount}</p>
                    <p className="text-white/30 text-xs">Visits</p>
                  </div>
                  <div>
                    <p className="text-yellow-400 font-pixel text-xl">{event.uniqueVisitors ?? 0}</p>
                    <p className="text-white/30 text-xs">Unique</p>
                  </div>
                  <div>
                    <p className="text-yellow-400 font-pixel text-xl">{event.downloadCount}</p>
                    <p className="text-white/30 text-xs">Downloads</p>
                  </div>
                </div>
              </div>

              {/* Customer Link */}
              {event.uniqueLink && (
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
                  <span className="text-white/20 text-xs">Customer link:</span>
                  <code className="text-yellow-400/60 text-xs">/find/{event.uniqueLink}</code>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
