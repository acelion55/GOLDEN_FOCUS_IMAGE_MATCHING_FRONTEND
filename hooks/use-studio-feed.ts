"use client";

import { useMemo } from "react";
import type { AspectRatio, GeneratedItem, FeedEntry } from "@/lib/types";
import type { HistoryRow } from "@/lib/queries/user-history";

export function useStudioFeed(items: GeneratedItem[], dbHistory: HistoryRow[]) {
  return useMemo<FeedEntry[]>(() => {
    const inMemoryIds = new Set(items.map((i) => i.id));
    const dbCompleted = dbHistory
      .filter((h) => !inMemoryIds.has(h.id) && h.image_url)
      .map((h) => ({
        id: h.id,
        mode: "image" as const,
        prompt: h.prompt,
        aspectRatio: h.aspect_ratio as AspectRatio,
        src: h.image_url!,
        posterUrl: null,
        muxPlaybackId: null,
        isVideo: false as const,
        isDb: true as const,
      }));
    return [
      ...items.map((i) => ({ ...i, isDb: false as const })),
      ...dbCompleted,
    ];
  }, [items, dbHistory]);
}
