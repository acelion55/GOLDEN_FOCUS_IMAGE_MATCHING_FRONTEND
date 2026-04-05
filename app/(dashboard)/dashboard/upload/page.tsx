"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface UploadResult { id: string; filename: string; url: string }
interface UploadError { filename: string; error: string }

export default function UploadPhotosPage() {
  const [eventName, setEventName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ uploaded: UploadResult[]; errors: UploadError[] } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFiles = useCallback((newFiles: FileList | File[]) => {
    const arr = Array.from(newFiles).filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...arr]);
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleUpload = async () => {
    if (!eventName.trim()) { alert("Please enter an event name"); return; }
    if (files.length === 0) { alert("Please select at least one photo"); return; }

    setIsUploading(true);
    setProgress(0);
    setResults(null);

    const token = localStorage.getItem("gf_token");
    const batchSize = 5;
    const allUploaded: UploadResult[] = [];
    const allErrors: UploadError[] = [];

    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      const formData = new FormData();
      formData.append("eventName", eventName.trim());
      batch.forEach((f) => formData.append("photos", f));

      try {
        const res = await fetch(`${API}/api/photographer/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const data = await res.json();
        if (data.uploaded) allUploaded.push(...data.uploaded);
        if (data.errors) allErrors.push(...data.errors);
      } catch {
        batch.forEach((f) => allErrors.push({ filename: f.name, error: "Upload failed" }));
      }

      setProgress(Math.min(100, Math.round(((i + batchSize) / files.length) * 100)));
    }

    setResults({ uploaded: allUploaded, errors: allErrors });
    setIsUploading(false);
    setFiles([]);
  };

  const fmt = (b: number) => b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`;

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto">
      <div>
        <h1 className="font-pixel text-2xl text-foreground mb-2">Upload Photos</h1>
        <p className="text-muted-foreground">Upload photos for an event. Face recognition will process automatically.</p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="eventName" className="text-sm text-muted-foreground">Event Name *</label>
        <Input
          id="eventName"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder="e.g., Wedding - Smith Family"
          disabled={isUploading}
        />
      </div>

      <div
        className={`border-2 border-dashed p-8 text-center transition-colors ${dragActive ? "border-primary bg-primary/10" : "border-border hover:border-muted-foreground"}`}
        onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
      >
        <input ref={fileInputRef} type="file" multiple accept="image/*"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden" disabled={isUploading} />
        <div className="flex flex-col items-center gap-4">
          <div className="text-4xl text-muted-foreground">+</div>
          <div>
            <p className="text-foreground mb-1">Drag and drop photos here, or</p>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
              Browse Files
            </Button>
          </div>
          <p className="text-muted-foreground text-sm">Supports JPG, PNG, WebP. Max 15MB per file.</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-foreground">Selected Photos ({files.length})</h3>
            <Button variant="ghost" size="sm" onClick={() => setFiles([])} disabled={isUploading}>Clear All</Button>
          </div>
          <div className="max-h-60 overflow-y-auto flex flex-col gap-2">
            {files.map((file, i) => (
              <div key={`${file.name}-${i}`} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-sm truncate">{file.name}</p>
                  <p className="text-muted-foreground text-xs">{fmt(file.size)}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setFiles((p) => p.filter((_, j) => j !== i))}
                  disabled={isUploading} className="text-destructive hover:text-destructive">
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div>
          <Button onClick={handleUpload} disabled={isUploading || !eventName.trim()} className="w-full">
            {isUploading ? `Uploading... ${progress}%` : `Upload ${files.length} Photos`}
          </Button>
          {isUploading && (
            <div className="mt-2 h-2 bg-muted overflow-hidden">
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
      )}

      {results && (
        <div className="flex flex-col gap-4">
          {results.uploaded.length > 0 && (
            <div className="border border-green-500/50 bg-green-500/10 p-4">
              <h3 className="font-medium text-green-400 mb-2">Successfully Uploaded ({results.uploaded.length})</h3>
              <p className="text-muted-foreground text-sm">Photos are being processed for face recognition. This may take a few minutes.</p>
            </div>
          )}
          {results.errors.length > 0 && (
            <div className="border border-destructive/50 bg-destructive/10 p-4">
              <h3 className="font-medium text-destructive mb-2">Failed ({results.errors.length})</h3>
              {results.errors.map((e, i) => (
                <p key={i} className="text-muted-foreground text-sm">{e.filename}: {e.error}</p>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setResults(null); setEventName(""); }}>Upload More</Button>
            <Button onClick={() => router.push("/dashboard/photos")}>View Photos</Button>
          </div>
        </div>
      )}
    </div>
  );
}
