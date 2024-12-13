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

  const lineDiff: Record<number, "new" | "removed" | "unchanged" | "updated"> =
    {};
  const oldTokens: string[] = [];
  const newTokens: string[] = [];
  const tokenMapping: Record<number, number | null> = {};

  let oldLineIndex = 0;
  let newLineIndex = 0;

  for (let i = 0; i < diff.length; i++) {
    const part = diff[i];
    const lines = part?.value.split("\n").filter(Boolean);

    if (part?.added) {
      const prevPart = i > 0 ? diff[i - 1] : null;
      if (prevPart?.removed) {
        // Handle potential "updated" lines
        const removedLines = prevPart.value.split("\n").filter(Boolean);
        lines?.forEach((newLine, index) => {
          const oldLine = removedLines[index];
          if (oldLine) {
            const oldLineTokens = tokenizeLine(oldLine);
            const newLineTokens = tokenizeLine(newLine);

            const { similarityPercentage, structuralDifferences } =
              computeTokenSimilarity(oldLineTokens, newLineTokens);

            if (similarityPercentage >= 70 && structuralDifferences > 0) {
              lineDiff[newLineIndex] = "updated";
            } else if (
              similarityPercentage < 100 ||
              oldLine.trim() !== newLine.trim()
            ) {
              lineDiff[newLineIndex] = "updated";
            } else {
              lineDiff[newLineIndex] = "unchanged";
            }

            oldTokens.push(...oldLineTokens);
            newTokens.push(...newLineTokens);

            oldLineTokens.forEach((token, tokenIdx) => {
              const matchIdx = newLineTokens.findIndex(
                (newToken) => newToken === token,
              );
              tokenMapping[tokenIdx + oldTokens.length - oldLineTokens.length] =
                matchIdx >= 0
                  ? matchIdx + newTokens.length - newLineTokens.length
                  : null;
            });
          } else {
            lineDiff[newLineIndex] = "new";
            newTokens.push(...tokenizeLine(newLine));
          }

          newLineIndex++;
        });
      } else {
        // Regular new lines
        lines?.forEach((line) => {
          lineDiff[newLineIndex] = "new";
          newTokens.push(...tokenizeLine(line));
          newLineIndex++;
        });
      }
    } else if (part?.removed) {
      lines?.forEach((line) => {
        lineDiff[oldLineIndex] = "removed";
        oldTokens.push(...tokenizeLine(line));
        oldLineIndex++;
      });
    } else {
      lines?.forEach((line) => {
        const oldLineTokens = tokenizeLine(line);
        const newLineTokens = tokenizeLine(line);

        oldTokens.push(...oldLineTokens);
        newTokens.push(...newLineTokens);

        const { similarityPercentage, structuralDifferences } =
          computeTokenSimilarity(oldLineTokens, newLineTokens);

        if (similarityPercentage === 100 && line.trim() === line.trim()) {
          lineDiff[newLineIndex] = "unchanged";
        } else if (similarityPercentage >= 70 && structuralDifferences > 0) {
          lineDiff[newLineIndex] = "updated";
        } else {
          lineDiff[newLineIndex] = "updated";
        }

        oldLineTokens.forEach((token, tokenIdx) => {
          const matchIdx = newLineTokens.findIndex(
            (newToken) => newToken === token,
          );
          tokenMapping[tokenIdx + oldTokens.length - oldLineTokens.length] =
            matchIdx >= 0
              ? matchIdx + newTokens.length - newLineTokens.length
              : null;
        });

        newLineIndex++;
        oldLineIndex++;
      });
    }
  }

  return { lineDiff, oldTokens, newTokens };
};
