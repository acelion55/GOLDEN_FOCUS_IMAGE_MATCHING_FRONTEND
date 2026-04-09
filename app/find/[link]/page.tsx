"use client";

import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface Photographer {
  name: string;
  businessName?: string;
  uniqueLink: string;
}

interface EventInfo {
  _id: string;
  name: string;
  photoCount: number;
  date?: string;
  driveLink?: string;
}

interface MatchedPhoto {
  _id: string;
  imageUrl: string;
  eventName: string;
  originalFilename: string;
  faceCount: number;
}

type Step = "landing" | "capture" | "results";

function CustomerPortalContent() {
  const { link } = useParams<{ link: string }>();
  const [photographer, setPhotographer] = useState<Photographer | null>(null);
  const [event, setEvent] = useState<EventInfo | null>(null);
  const [isEventLink, setIsEventLink] = useState(false);
  const [sessionId] = useState(() => uuidv4());
  const [step, setStep] = useState<Step>("landing");
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [matchedPhotos, setMatchedPhotos] = useState<MatchedPhoto[]>([]);
  const [searchMessage, setSearchMessage] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`${API}/api/customer/${link}`, {
      headers: { "x-session-id": sessionId },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.photographer) {
          setPhotographer(d.photographer);
          setIsEventLink(!!d.isEventLink);
          if (d.isEventLink && d.event) setEvent(d.event);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true));
  }, [link, sessionId]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch {
      alert("Could not access camera. Please upload a photo instead.");
    }
  };

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraActive(false);
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      setSelfieFile(new File([blob], "selfie.jpg", { type: "image/jpeg" }));
      setSelfiePreview(URL.createObjectURL(blob));
      stopCamera();
    }, "image/jpeg", 0.9);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelfieFile(file);
    setSelfiePreview(URL.createObjectURL(file));
  };

  const searchPhotos = async () => {
    if (!selfieFile) return;
    setIsSearching(true);
    setSearchMessage("");
    const formData = new FormData();
    formData.append("selfie", selfieFile);

    try {
      const res = await fetch(`${API}/api/customer/${link}/search`, {
        method: "POST",
        headers: { "x-session-id": sessionId },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setSearchMessage(data.error || "Search failed. Please try again.");
        setMatchedPhotos([]);
      } else {
        setMatchedPhotos(data.photos || []);
        setSearchMessage(data.message || "");
      }
      setStep("results");
    } catch {
      setSearchMessage("Network error. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const downloadPhoto = (photo: MatchedPhoto) => {
    fetch(`${API}/api/customer/${link}/download`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photoId: photo._id, sessionId }),
    }).catch(() => {});
    const a = document.createElement("a");
    a.href = photo.imageUrl;
    a.download = photo.originalFilename;
    a.target = "_blank";
    a.click();
  };

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center">
          <h1 className="font-pixel text-2xl text-primary mb-4">GoldenFocus AI</h1>
          <p className="text-muted-foreground">This link is not valid or has been deactivated.</p>
        </div>
      </div>
    );
  }

  if (!photographer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-4 py-4 text-center">
        <h1 className="font-pixel text-xl text-primary">{photographer.businessName || photographer.name}</h1>
        {isEventLink && event ? (
          <p className="text-muted-foreground text-sm mt-1">📸 {event.name}</p>
        ) : (
          <p className="text-muted-foreground text-sm mt-1">Find your photos using face recognition</p>
        )}
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">

        {/* Event info banner */}
        {isEventLink && event && (
          <div className="border border-border bg-card p-4 mb-6 flex flex-col gap-2">
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{event.name}</span>
              {event.date && <span>📅 {new Date(event.date).toLocaleDateString("en-IN")}</span>}
              <span>🖼 {event.photoCount} photos</span>
            </div>
            {event.driveLink && (
              <a href={event.driveLink} target="_blank" rel="noopener noreferrer"
                className="text-primary text-sm hover:underline">
                📁 View all photos on Google Drive →
              </a>
            )}
          </div>
        )}

        {/* Step: Landing */}
        {step === "landing" && (
          <div className="border border-border bg-card p-6 text-center">
            <h2 className="font-pixel text-lg text-foreground mb-3">Find Your Photos</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Take a selfie or upload a photo of yourself. Our AI will find all photos you appear in
              {isEventLink && event ? ` from "${event.name}"` : ""}.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => { setStep("capture"); startCamera(); }} className="flex-1">
                📷 Take a Selfie
              </Button>
              <Button variant="outline" onClick={() => { setStep("capture"); fileInputRef.current?.click(); }} className="flex-1">
                🖼 Upload a Photo
              </Button>
            </div>
          </div>
        )}

        {/* Step: Capture */}
        {step === "capture" && (
          <div className="flex flex-col gap-6">
            <input ref={fileInputRef} type="file" accept="image/*" capture="user"
              onChange={handleFileUpload} className="hidden" />

            {cameraActive && !selfiePreview && (
              <div className="flex flex-col gap-4">
                <div className="relative border border-border overflow-hidden bg-black aspect-video rounded-xl">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                </div>
                <div className="flex gap-3">
                  <Button onClick={capturePhoto} className="flex-1">Capture</Button>
                  <Button variant="outline" onClick={() => { stopCamera(); setStep("landing"); }}>Cancel</Button>
                </div>
              </div>
            )}

            {!cameraActive && !selfiePreview && (
              <div className="border border-border bg-card p-6 text-center">
                <p className="text-muted-foreground mb-4">Upload a clear photo of your face</p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Button onClick={startCamera}>Open Camera</Button>
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>Choose File</Button>
                  <Button variant="ghost" onClick={() => setStep("landing")}>Back</Button>
                </div>
              </div>
            )}

            {selfiePreview && (
              <div className="flex flex-col gap-4">
                <div className="border border-border overflow-hidden rounded-xl">
                  <Image src={selfiePreview} alt="Your selfie" width={400} height={400}
                    className="w-full max-h-80 object-contain bg-black" />
                </div>
                <p className="text-muted-foreground text-sm text-center">Make sure your face is clearly visible</p>
                <div className="flex gap-3">
                  <Button onClick={searchPhotos} disabled={isSearching} className="flex-1">
                    {isSearching ? "Searching..." : "Find My Photos"}
                  </Button>
                  <Button variant="outline" onClick={() => { setSelfiePreview(null); setSelfieFile(null); }}>
                    Retake
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step: Results */}
        {step === "results" && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="font-pixel text-xl text-foreground">
                {matchedPhotos.length > 0 ? `Found ${matchedPhotos.length} Photos` : "No Photos Found"}
              </h2>
              <Button variant="outline" size="sm" onClick={() => {
                setStep("landing"); setSelfiePreview(null); setSelfieFile(null); setMatchedPhotos([]);
              }}>
                Search Again
              </Button>
            </div>

            {searchMessage && (
              <div className="border border-border bg-card p-4 rounded">
                <p className="text-muted-foreground text-sm">{searchMessage}</p>
              </div>
            )}

            {matchedPhotos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {matchedPhotos.map((photo) => (
                  <div key={photo._id} className="border border-border bg-card overflow-hidden group rounded-lg">
                    <div className="aspect-square relative">
                      <Image src={photo.imageUrl} alt={photo.originalFilename} fill
                        className="object-cover" sizes="(max-width: 640px) 50vw, 33vw" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button size="sm" onClick={() => downloadPhoto(photo)}>Download</Button>
                      </div>
                    </div>
                    <div className="p-2">
                      <Button variant="ghost" size="sm" className="w-full h-7 text-xs"
                        onClick={() => downloadPhoto(photo)}>
                        ⬇ Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {matchedPhotos.length === 0 && !searchMessage && (
              <div className="border border-border bg-card p-8 text-center rounded-xl">
                <p className="text-muted-foreground mb-2">No photos found matching your face.</p>
                <p className="text-muted-foreground text-sm">Try with a clearer, well-lit photo of your face.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function CustomerPortalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="text-muted-foreground">Loading...</div></div>}>
      <CustomerPortalContent />
    </Suspense>
  );
}
