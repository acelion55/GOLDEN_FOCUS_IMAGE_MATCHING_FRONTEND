import { cache } from "react";
import { hasDatabase, sql } from "@/lib/db";
import { cacheLife, cacheTag } from "next/cache";
import type { ExploreRow } from "@/lib/explore-queries";
import { SEED_GENERATIONS } from "@/lib/seed-data";

export const fetchGeneration = cache(async function fetchGeneration(id: string): Promise<ExploreRow | null> {
  const seed = SEED_GENERATIONS.find((s) => s.id === id);
  if (seed) return seed;

  if (!hasDatabase) return null;

  throw new Error("Database not configured");
});

export async function fetchGenerationAny(id: string): Promise<ExploreRow | null> {
  const seed = SEED_GENERATIONS.find((s) => s.id === id);
  if (seed) return seed;

  if (!hasDatabase) return null;

  throw new Error("Database not configured");
}

export async function getGeneration(id: string) {
  "use cache";
  cacheLife("days");
  cacheTag("generation", `generation-${id}`);
  return fetchGeneration(id);
}
