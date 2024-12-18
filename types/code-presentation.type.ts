export interface Slide {
  id: number;
  code: string;
  description?: string;
}

export interface DiffResult {
  lineDiff: Record<number, "new" | "unchanged">;
  oldTokens: string[];
  newTokens: string[];
}

export type CardTheme =
  | "minimal"
  | "defaultColorLess"
  | "default"
  | "leftName"
  | "centerName"
  | "rightName"
  | "window";
