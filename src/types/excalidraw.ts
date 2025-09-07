// Excalidraw types - centralized to avoid import issues during build
// Created by Jean-Claude - because someone needs to handle TypeScript being picky

export interface ExcalidrawElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  angle?: number;
  strokeColor?: string;
  backgroundColor?: string;
  fillStyle?: string;
  strokeWidth?: number;
  roughness?: number;
  opacity?: number;
  groupIds?: string[];
  frameId?: string | null;
  index?: string;
  seed?: number;
  versionNonce?: number;
  isDeleted?: boolean;
  link?: string | null;
  locked?: boolean;
  [key: string]: any;
}

// Re-export for convenience so we don't have import issues
export type { ExcalidrawElement as Element };