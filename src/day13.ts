export interface Puzzle {
  lines: string[][];
}

export function parseInput(input: string): Puzzle[] {
  return input.split("\n\n").map((ls) => ({ lines: ls.split("\n").map((l) => [...l]) }));
}

export function transpose(puzzle: Puzzle): Puzzle {
  return { lines: puzzle.lines[0].map((_, colIndex) => puzzle.lines.map(row => row[colIndex]))}
}

export function lineEqual(line1: string[], line2: string[]) {
  return JSON.stringify(line1) === JSON.stringify(line2);
}

export function isMirrorAfterLine(puzzle: Puzzle, line: number): boolean {
  const maxDiff = Math.min(line, puzzle.lines.length - line - 2);
  for (let i = 0; i <= maxDiff; i++) {
    if (!lineEqual(puzzle.lines[line - i], puzzle.lines[line + i + 1])) {
      return false;
    }
  }
  return true;
}

export function findHorizontalMirror(puzzle: Puzzle): number | undefined {
  for (let line = 0; line < puzzle.lines.length - 1; line++) {
    if (isMirrorAfterLine(puzzle, line)) {
      return line + 1;
    }
  }
  return;
}

export function day13part1(input: string): number {
  return parseInput(input).reduce((prevSum, puzzle) => {
    const horizontal = findHorizontalMirror(puzzle);
    const vertical = findHorizontalMirror(transpose(puzzle));
//     return prevSum + 100 * (horizontal ?? 0) + (vertical ?? 0);
    if (horizontal !== undefined) {
      return prevSum + 100 * horizontal;
    } else {
      if (vertical !== undefined) {
        return prevSum + vertical;
      } else {
        throw new Error("No mirror found");
      }
    }
  }, 0);
}