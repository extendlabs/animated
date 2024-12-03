export interface Slide {
    id: number;
    code: string;
    description?: string;
  }
  
  export interface DiffResult {
    lineDiff: Record<number, 'changed' | 'stale' | 'updated'>;
    oldTokens: string[][];
    newTokens: string[][];
    matchingTokens: string[];
  }
  
  export interface CodePresentationProps {
    slides: Slide[];
    autoPlayInterval?: number;
  }