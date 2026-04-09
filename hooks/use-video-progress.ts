"use client";

import { useRef } from "react";
import type { GeneratedItem } from "@/lib/types";

const IMAGES_KEY = "gcs-generated-images";

export function saveGeneratedImages(items: GeneratedItem[]) {
  const completed = items.filter((i) => i.mode === "image" && (i.base64 || i.imageUrl));
  if (completed.length === 0) { localStorage.removeItem(IMAGES_KEY); return; }
  const serialisable = completed.filter((i) => i.imageUrl).map(({ base64: _b64, ...rest }) => rest);
  if (serialisable.length === 0) { localStorage.removeItem(IMAGES_KEY); return; }
  try { localStorage.setItem(IMAGES_KEY, JSON.stringify(serialisable)); } catch { localStorage.removeItem(IMAGES_KEY); }
}

export function loadGeneratedImages(): GeneratedItem[] {
  try {
    const raw = localStorage.getItem(IMAGES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as GeneratedItem[];
  } catch { return []; }
}

export type InFlightEntry = {
  interval: ReturnType<typeof setInterval>;
  abort: AbortController;
};

export function useVideoProgress(
  _items: GeneratedItem[],
  _setItems: React.Dispatch<React.SetStateAction<GeneratedItem[]>>,
  _mutateHistory: () => void,
) {
  const progressMap = new Map<string, number>();
  const inFlightRef = useRef<Map<string, InFlightEntry>>(new Map());
  const [_progressState, _setProgressMap] = [progressMap, (_v: unknown) => {}];

  return {
    progressMap,
    setProgressMap: (_v: unknown) => {},
    inFlightRef,
    reconnectDbVideos: (_dbHistory: unknown[]) => {},
  };
}
