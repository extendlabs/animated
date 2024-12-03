import { type DiffResult } from "types/code-presentation.type";


export const tokenizeLine = (line: string): string[] => {
  return line.split(/(<[^>]+>|\{[^}]+\}|[()[\]]|\s+)/)
    .filter(token => token.trim() !== '');
};

export const computeTokenSimilarity = (baseTokens: string[], compareTokens: string[]) => {
  const matches = baseTokens.filter(token => compareTokens.includes(token));
  const similarityPercentage = (matches.length / baseTokens.length) * 100;
  return { similarityPercentage, matches };
};

export const computeDiff = (oldCode: string, newCode: string): DiffResult => {
  const oldLines = oldCode.split('\n');
  const newLines = newCode.split('\n');
  
  const lineDiff: Record<number, 'changed' | 'stale' | 'updated'> = {};
  const oldTokens: string[][] = [];
  const newTokens: string[][] = [];
  const tokenizedLines = new Set<string>();
  const matchingTokens = new Set<string>();

  oldLines.forEach((line) => {
    if (!tokenizedLines.has(line)) {
      const tokens = tokenizeLine(line);
      oldTokens.push(tokens);
      tokenizedLines.add(line);
    }
  });

  tokenizedLines.clear();

  newLines.forEach((line, index) => {
    const matchingOldLine = oldLines.find((oldLine) => oldLine === line);
    
    if (matchingOldLine) {
      lineDiff[index] = 'stale';
    } else {
      lineDiff[index] = 'changed';
      oldTokens.forEach((tokens) => {
        const { similarityPercentage, matches } = computeTokenSimilarity(tokens, tokenizeLine(line));
        if (similarityPercentage > 90) {
          lineDiff[index] = 'updated';
          matches.forEach((token) => matchingTokens.add(token));
        }
      });
      
      if (!tokenizedLines.has(line)) {
        const tokens = tokenizeLine(line);
        newTokens.push(tokens);
        tokenizedLines.add(line);
      }
    }
  });

  return {
    lineDiff,
    oldTokens,
    newTokens,
    matchingTokens: Array.from(matchingTokens),
  };
};