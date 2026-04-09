"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";
import type { GeneratedItem, AspectRatio, GenerationMode, ExploreSelectionType, GenerationSelectionType } from "@/lib/types";
import type { InFlightEntry } from "@/hooks/use-video-progress";

interface UseStudioGenerateParams {
  promptRef: RefObject<string>;
  aspectRatioRef: RefObject<AspectRatio>;
  modeRef: RefObject<GenerationMode>;
  durationRef: RefObject<number>;
  attachmentRef: RefObject<string | null>;
  videoAttachmentRef: RefObject<string | null>;
  setPrompt: (v: string) => void;
  setAttachment: (v: string | null) => void;
  setVideoAttachment: (v: string | null) => void;
  setError: (v: string | null) => void;
  setShowExplore: (v: boolean) => void;
  setExploreSelection: (v: ExploreSelectionType) => void;
  setGenerationSelection: (v: GenerationSelectionType) => void;
  setItems: React.Dispatch<React.SetStateAction<GeneratedItem[]>>;
  setVisibleId: (v: string | null) => void;
  setActiveGenerations: React.Dispatch<React.SetStateAction<number>>;
  setProgressMap: React.Dispatch<React.SetStateAction<Map<string, number>>>;
  inFlightRef: RefObject<Map<string, InFlightEntry>>;
  feedRef: RefObject<HTMLDivElement | null>;
  mutateHistory: () => void;
}

export function useStudioGenerate(params: UseStudioGenerateParams) {
  const p = useRef(params);
  p.current = params;

  const prefersReducedMotionRef = useRef(false);
  useEffect(() => {
    prefersReducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const handleGenerate = useCallback(async () => {
    const {
      promptRef, aspectRatioRef, attachmentRef,
      setPrompt: _setPrompt, setAttachment, setVideoAttachment,
      setError, setShowExplore, setExploreSelection, setGenerationSelection,
      setItems, setVisibleId, setActiveGenerations, setProgressMap,
      inFlightRef, feedRef,
    } = p.current;

    if (!promptRef.current.trim()) return;

    setError(null);
    const currentPrompt = promptRef.current.trim();
    const currentRatio = aspectRatioRef.current;
    const currentAttachment = attachmentRef.current;
    const itemId = crypto.randomUUID();
    const abort = new AbortController();

    setAttachment(null);
    setVideoAttachment(null);
    setShowExplore(false);
    setExploreSelection(null);
    setGenerationSelection(null);
    setVisibleId(itemId);
    setActiveGenerations((n) => n + 1);

    setItems((prev) => [
      { id: itemId, mode: "image", prompt: currentPrompt, aspectRatio: currentRatio, timestamp: Date.now() },
      ...prev,
    ]);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      let target: number;
      if (elapsed < 2) target = (elapsed / 2) * 60;
      else if (elapsed < 7) target = 60 + ((elapsed - 2) / 5) * 25;
      else target = Math.min(95, 85 + (elapsed - 7) * 0.5);
      setProgressMap((prev) => {
        const cur = prev.get(itemId) ?? 0;
        if (target <= cur) return prev;
        return new Map(prev).set(itemId, Math.round(target));
      });
    }, 100);

    inFlightRef.current.set(itemId, { interval, abort });
    setProgressMap((prev) => new Map(prev).set(itemId, 0));

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: currentPrompt,
          aspectRatio: currentRatio,
          id: itemId,
          ...(currentAttachment ? { imageBase64: currentAttachment } : {}),
        }),
        signal: abort.signal,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Generation failed");
      }

      const data = await response.json();
      const preloadSrc = data.imageUrl || `data:image/png;base64,${data.image}`;
      await new Promise<void>((resolve) => {
        const img = new window.Image();
        const done = () => { img.onload = null; img.onerror = null; resolve(); };
        img.onload = done; img.onerror = done; img.src = preloadSrc;
        setTimeout(done, 3000);
      });

      setItems((prev) => prev.map((item) => item.id === itemId ? { ...item, base64: data.image, imageUrl: data.imageUrl } : item));
      clearInterval(interval);
      inFlightRef.current.delete(itemId);
      setActiveGenerations((n) => Math.max(0, n - 1));
      setProgressMap((prev) => new Map(prev).set(itemId, 100));
      setTimeout(() => { setProgressMap((prev) => { const next = new Map(prev); next.delete(itemId); return next; }); }, 500);
    } catch (err) {
      clearInterval(interval);
      inFlightRef.current.delete(itemId);
      setActiveGenerations((n) => Math.max(0, n - 1));
      setProgressMap((prev) => { const next = new Map(prev); next.delete(itemId); return next; });
      if (err instanceof Error && err.name === "AbortError") { setItems((prev) => prev.filter((item) => item.id !== itemId)); return; }
      setError(err instanceof Error ? err.message : "Something went wrong");
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    }

    requestAnimationFrame(() => {
      feedRef.current?.scrollTo({ top: 0, behavior: prefersReducedMotionRef.current ? "instant" : "smooth" });
    });
  }, []);

  const handleCancelItem = useCallback((itemId: string) => {
    const { inFlightRef, setActiveGenerations, setProgressMap, setItems, mutateHistory } = p.current;
    const entry = inFlightRef.current.get(itemId);
    if (entry) { clearInterval(entry.interval); entry.abort.abort(); inFlightRef.current.delete(itemId); }
    setActiveGenerations((n) => Math.max(0, n - 1));
    setProgressMap((prev) => { const next = new Map(prev); next.delete(itemId); return next; });
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    fetch(`/api/generations/${itemId}`, { method: "DELETE" }).catch(() => {});
    mutateHistory();
  }, []);

  return { handleGenerate, handleCancelItem };
}
