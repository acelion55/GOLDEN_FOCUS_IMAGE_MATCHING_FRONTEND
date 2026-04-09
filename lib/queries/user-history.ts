import { cache } from "react";
import { hasDatabase, sql } from "@/lib/db";

export interface HistoryRow {
  id: string;
  mode: string;
  prompt: string;
  aspect_ratio: string;
  image_url: string | null;
  video_url: string | null;
  mux_playback_id: string | null;
  run_id: string | null;
  created_at: string;
}

export const fetchUserHistory = cache(async (userId: string): Promise<HistoryRow[]> => {
  if (!hasDatabase) return [];

  throw new Error("Database not configured");
});

// ── Cursor-based pagination ──────────────────────────────────────────

const HISTORY_PAGE_SIZE = 100;

function decodeCursor(raw: string): { created_at: string; id: string } | null {
  try {
    const decoded = JSON.parse(
      Buffer.from(raw, "base64url").toString("utf-8"),
    );
    if (typeof decoded.created_at !== "string" || typeof decoded.id !== "string") {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

function encodeCursor(row: HistoryRow): string {
  return Buffer.from(
    JSON.stringify({ created_at: row.created_at, id: row.id }),
  ).toString("base64url");
}

export interface HistoryPage {
  rows: HistoryRow[];
  nextCursor: string | null;
}

export async function fetchUserHistoryPage(
  userId: string,
  cursorParam?: string,
  limit: number = HISTORY_PAGE_SIZE,
): Promise<HistoryPage> {
  if (!hasDatabase) return { rows: [], nextCursor: null };

  throw new Error("Database not configured");
}

export async function fetchUserHistoryCount(userId: string): Promise<number> {
  if (!hasDatabase) return 0;

  throw new Error("Database not configured");
}
