import { diffLines } from "diff";
import { type DiffResult } from "types/code-presentation.type";

export const tokenizeLine = (line: string): string[] => {
  return line
    .split(/(<[^>]+>|\{[^}]+\}|[()[\]]|\s+)/)
    .filter((token) => token.trim() !== "");
};

export const computeTokenSimilarity = (
  baseTokens: string[],
  compareTokens: string[],
) => {
  let matches = 0;
  let structuralDifferences = 0;

  const compareSet = new Set(compareTokens);
  baseTokens.forEach((token) => {
    if (compareSet.has(token)) {
      matches++;
    } else if (/<[^>]+>|\{[^}]+\}/.test(token)) {
      structuralDifferences++;
    }
  });

  const similarityPercentage = (matches / baseTokens.length) * 100;
  return { similarityPercentage, structuralDifferences };
};

export const computeDiff = (oldCode: string, newCode: string): DiffResult => {
  const cleanOldCode = oldCode.replace(/\r/g, "").trim();
  const cleanNewCode = newCode.replace(/\r/g, "").trim();

  const diff = diffLines(cleanOldCode, cleanNewCode);

  const lineDiff: Record<number, "new" | "unchanged"> = {};
  const oldTokens: string[] = [];
  const newTokens: string[] = [];

  let oldLineIndex = 0;
  let newLineIndex = 0;

  for (const part of diff) {
    const lines = part?.value.split("\n").filter(Boolean);

    if (part?.added) {
      lines.forEach((line) => {
        lineDiff[newLineIndex] = "new";
        newTokens.push(...tokenizeLine(line));
        newLineIndex++;
      });
    } else if (part?.removed) {
      lines.forEach((line) => {
        oldTokens.push(...tokenizeLine(line));
        oldLineIndex++;
      });
    } else {
      lines.forEach((line) => {
        const oldLineTokens = tokenizeLine(line);
        const newLineTokens = tokenizeLine(line);

        oldTokens.push(...oldLineTokens);
        newTokens.push(...newLineTokens);

        lineDiff[newLineIndex] = "unchanged";

        newLineIndex++;
        oldLineIndex++;
      });
    }
  }

  return { lineDiff, oldTokens, newTokens };
};