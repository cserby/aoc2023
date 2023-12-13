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

export function lineDiff(line1: string[], line2: string[]): number {
  return line1.reduce((errors, _, index) => 
    errors + (line1[index] === line2[index] ? 0 : 1)
  , 0);
}

export function isMirrorAfterLineWithSmudge(puzzle: Puzzle, line: number): boolean {
  const maxDiff = Math.min(line, puzzle.lines.length - line - 2);
  let errors = 0;
  for (let i = 0; i <= maxDiff; i++) {
    errors += lineDiff(puzzle.lines[line - i], puzzle.lines[line + i + 1]);
    if (errors > 1) {
      return false;
    }
  }
  return true;
}

export function findHorizontalMirror(puzzle: Puzzle, allowSmudge = false): number | undefined {
  for (let line = 0; line < puzzle.lines.length - 1; line++) {
    if (
      (!allowSmudge && isMirrorAfterLine(puzzle, line)) ||
      (allowSmudge && isMirrorAfterLineWithSmudge(puzzle, line))
    ) {
      return line + 1;
    }
  }
  return;
}

export function day13part1(input: string): number {
  return parseInput(input).reduce((prevSum, puzzle) => {
    const horizontal = findHorizontalMirror(puzzle);
    if (horizontal !== undefined) {
      return prevSum + 100 * horizontal;
    } else {
      const vertical = findHorizontalMirror(transpose(puzzle));
      if (vertical !== undefined) {
        return prevSum + vertical;
      } else {
        throw new Error("No mirror found");
      }
    }
  }, 0);
}

export function day13part2(input: string): number {
  return parseInput(input).reduce((prevSum, puzzle) => {
    const horizontal = findHorizontalMirror(puzzle, true);
    const vertical = findHorizontalMirror(transpose(puzzle), true);
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