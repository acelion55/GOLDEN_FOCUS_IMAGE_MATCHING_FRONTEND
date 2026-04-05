"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Event {
  _id: string;
  name: string;
  description?: string;
  date?: string;
  venue?: string;
  clientName?: string;
  driveLink?: string;
  shareLink: string;
  photoCount: number;
  isActive: boolean;
  createdAt: string;
}

const ORIGIN = typeof window !== "undefined" ? window.location.origin : "";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "", description: "", date: "", venue: "", clientName: "", driveLink: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const fetchEvents = () => {
    setIsLoading(true);
    apiFetch("/api/photographer/events")
      .then((r) => r.json())
      .then((d) => setEvents(d.events || []))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { fetchEvents(); }, []);

  const createEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setCreating(true);
    setError("");
    try {
      const res = await apiFetch("/api/photographer/events", {
        method: "POST",
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description || undefined,
          date: form.date || undefined,
          venue: form.venue || undefined,
          clientName: form.clientName || undefined,
          driveLink: form.driveLink || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to create event"); return; }
      setShowCreate(false);
      setForm({ name: "", description: "", date: "", venue: "", clientName: "", driveLink: "" });
      fetchEvents();
    } catch {
      setError("Network error");
    } finally {
      setCreating(false);
    }
  };

  const deleteEvent = async (id: string, name: string) => {
    if (!confirm(`Delete event "${name}" and all its photos?`)) return;
    await apiFetch(`/api/photographer/events/${id}`, { method: "DELETE" });
    fetchEvents();
  };

  const copyLink = (shareLink: string, id: string) => {
    navigator.clipboard.writeText(`${ORIGIN}/find/${shareLink}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-pixel text-2xl text-foreground">Events</h1>
        <Button onClick={() => { setShowCreate(!showCreate); setError(""); }}>
          {showCreate ? "Cancel" : "+ New Event"}
        </Button>
      </div>

      {showCreate && (
        <form onSubmit={createEvent} className="border border-border bg-card p-6 flex flex-col gap-4" noValidate>
          <h2 className="font-pixel text-lg text-foreground">Create New Event</h2>
          {error && <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-2 text-sm rounded">{error}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-muted-foreground">Event Name *</label>
              <Input value={form.name} onChange={set("name")} placeholder="e.g., Sharma Wedding" disabled={creating} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-muted-foreground">Client Name</label>
              <Input value={form.clientName} onChange={set("clientName")} placeholder="e.g., Rahul & Priya" disabled={creating} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-muted-foreground">Event Date</label>
              <Input type="date" value={form.date} onChange={set("date")} disabled={creating} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-muted-foreground">Venue</label>
              <Input value={form.venue} onChange={set("venue")} placeholder="e.g., Hotel Grand, Jaipur" disabled={creating} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-muted-foreground">Google Drive Link</label>
            <Input value={form.driveLink} onChange={set("driveLink")} placeholder="https://drive.google.com/drive/folders/..." disabled={creating} />
            <p className="text-xs text-muted-foreground">Customers will be able to access photos from this drive link</p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-muted-foreground">Description</label>
            <Input value={form.description} onChange={set("description")} placeholder="Optional notes about this event" disabled={creating} />
          </div>

          <Button type="submit" disabled={creating || !form.name.trim()} className="self-start px-8">
            {creating ? "Creating..." : "Create Event"}
          </Button>
        </form>
      )}

      {isLoading ? (
        <div className="text-muted-foreground py-8 text-center">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground mb-2 font-pixel">No events yet</p>
          <p className="text-muted-foreground text-sm mb-6">Create your first event to get a shareable customer link</p>
          <Button onClick={() => setShowCreate(true)}>Create First Event</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {events.map((event) => (
            <div key={event._id} className="border border-border bg-card p-5 flex flex-col gap-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium text-foreground text-lg">{event.name}</h3>
                  <div className="flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground">
                    {event.clientName && <span>👤 {event.clientName}</span>}
                    {event.date && <span>📅 {new Date(event.date).toLocaleDateString("en-IN")}</span>}
                    {event.venue && <span>📍 {event.venue}</span>}
                    <span>🖼 {event.photoCount} photos</span>
                  </div>
                  {event.description && <p className="text-muted-foreground text-sm mt-1">{event.description}</p>}
                </div>
                <Button
                  variant="ghost" size="sm"
                  className="text-destructive hover:text-destructive shrink-0"
                  onClick={() => deleteEvent(event._id, event.name)}
                >
                  Delete
                </Button>
              </div>

              {/* Drive Link */}
              {event.driveLink && (
                <div className="flex items-center gap-2 bg-background border border-border px-3 py-2 rounded text-sm">
                  <span className="text-muted-foreground shrink-0">📁 Drive:</span>
                  <a href={event.driveLink} target="_blank" rel="noopener noreferrer"
                    className="text-primary hover:underline truncate flex-1">{event.driveLink}</a>
                </div>
              )}

              {/* Customer Share Link */}
              <div className="flex flex-col gap-2">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Customer Share Link</p>
                <div className="flex items-center gap-2">
                  <code className="bg-background border border-border px-3 py-2 text-sm text-foreground flex-1 truncate rounded">
                    {ORIGIN}/find/{event.shareLink}
                  </code>
                  <Button
                    size="sm"
                    variant={copiedId === event._id ? "default" : "outline"}
                    onClick={() => copyLink(event.shareLink, event._id)}
                    className="shrink-0"
                  >
                    {copiedId === event._id ? "✓ Copied!" : "Copy Link"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Share this link with customers — they upload their photo and see matching photos from this event
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
