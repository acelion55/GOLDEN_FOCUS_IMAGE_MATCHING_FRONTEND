export type AspectRatio =
  | "1:1"
  | "16:9"
  | "9:16"
  | "4:3"
  | "3:4"
  | "3:2"
  | "2:3";

export type GenerationMode = "image" | "video";

export type ExploreSelectionType = { id: string; src: string; alt: string } | null;
export type GenerationSelectionType = null;

export type FeedEntry =
  | (GeneratedItem & { isDb: false })
  | {
      id: string;
      mode: "image";
      prompt: string;
      aspectRatio: AspectRatio;
      src: string;
      posterUrl: null;
      muxPlaybackId: null;
      isVideo: false;
      isDb: true;
    };

export interface GeneratedItem {
  id: string;
  mode: GenerationMode;
  prompt: string;
  aspectRatio: AspectRatio;
  timestamp: number;
  base64?: string;
  imageUrl?: string;
}
