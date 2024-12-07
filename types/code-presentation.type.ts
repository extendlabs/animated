export interface Slide {
  id: number;
  code: string;
  description?: string;
}

export interface DiffResult {
  lineDiff: Record<number, "new" | "removed" | "unchanged">;
  oldTokens: string[];
  newTokens: string[];

}

export interface CodePresentationProps {
  autoPlayInterval?: number;
}
