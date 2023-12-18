type Direction = "U" | "D" | "L" | "R";

interface Position {
  line: number;
  char: number;
}

interface Step {
  direction: Direction;
  steps: number;
  color: string;
}

function parseStep(line: string): Step {
  const [direction, stepsStr, color] = line.split(" ");

  return {
    direction: direction as Direction,
    steps: parseInt(stepsStr),
    color,
  }
}

export function parseInput(input: string): Step[] {
  return input.split("\n").map(parseStep);
}

function move(pos: Position, direction: Direction): Position {
  switch (direction) {
    case "D": return { line: pos.line + 1, char: pos.char };
    case "L": return { line: pos.line, char: pos.char - 1 };
    case "R": return { line: pos.line, char: pos.char + 1 };
    case "U": return { line: pos.line - 1, char: pos.char };
  }
}

export function dig(steps: Step[], start: Position = { line: 0, char: 0 }): Position[] {
  const positions: Position[] = [start];

  let currPos = start;

  for (const step of steps) {
    for (let i = 0; i < step.steps; i++) {
      currPos = move(currPos, step.direction);
      positions.push(currPos);
    }
  }

  return positions;
}

interface Extremes {
  minChar: number;
  maxChar: number;
  minLine: number;
  maxLine: number;
}

function extremes(positions: Position[]): Extremes {
  const chars = positions.map((p) => p.char);
  const minChar = Math.min(...chars);
  const maxChar = Math.max(...chars);

  const lines = positions.map((p) => p.line);
  const minLine = Math.min(...lines);
  const maxLine = Math.max(...lines);

  return {
    minChar,
    maxChar,
    minLine,
    maxLine
  };
}

export function plot(positions: Position[], pad: number = 0): string {
  const { minChar, maxChar, minLine, maxLine } = extremes(positions); 

  let plot = "";

  for (let l = minLine - pad; l <= maxLine + pad; l++) {
    for (let c = minChar - pad; c <= maxChar + pad; c++) {
      if (positions.find((p) => p.line === l && p.char === c) !== undefined) {
        plot += "#";
      } else {
        plot += ".";
      }
    }
    plot += "\n";
  }
  return plot;
}

function neighbors<T>(arr: T[][], pos: Position): Position[] {
  const neighbors = [];
  if (pos.line > 0) neighbors.push({ line: pos.line - 1, char: pos.char });
  if (pos.char > 0) neighbors.push({ line: pos.line, char: pos.char - 1 });
  if (pos.line < arr.length - 1) neighbors.push({ line: pos.line + 1, char: pos.char });
  if (pos.char < arr[0].length - 1) neighbors.push({ line: pos.line, char: pos.char + 1 });
  return neighbors;
}

export function calculateVolume(positions: Position[]): number {
  const lines = plot(positions).split("\n").map((l) => [...l]);

  const startLine = lines.findIndex((l) => l[0] === "#" && l.includes("."));
  const startChar = [...lines[startLine]].findIndex((c) => c === ".");

  let needToFill = [{ line: startLine, char: startChar }];

  while (needToFill.length > 0) {
    const fillFrom = needToFill.pop()!;

    if (lines[fillFrom.line][fillFrom.char] === "#") continue;
    else {
      lines[fillFrom.line][fillFrom.char] = "#";

      needToFill.push(
        ...neighbors(lines, fillFrom)
          .filter((n) => lines[n.line][n.char] === ".")
      );
    }
  }

  return lines.map((l) => l.filter((c) => c === "#").length).reduce((a, b) => a + b);
}

export function day18part1(input: string): number {
  return calculateVolume(dig(parseInput(input)));
}
