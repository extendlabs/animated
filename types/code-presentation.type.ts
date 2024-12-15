export interface Slide {
  id: number;
  code: string;
  description?: string;
}

export interface DiffResult {
  lineDiff: Record<number, "new" | "removed" | "unchanged" | "updated">;
  oldTokens: string[];
  newTokens: string[];
}

export interface CodePresentationProps {
  autoPlayInterval?: number;
}

export type CardTheme =
  | "minimal"
  | "defaultColorLess"
  | "default"
  | "leftName"
  | "centerName"
  | "rightName"
  | "window";
