type Field = "." | "#" | ">" | "<" | "v" | "^";

type SnowIsland = Field[][];

interface Position {
  line: number;
  char: number;
}

export function parseInput(input: string): SnowIsland {
  return input.split("\n").map((l) => [...l] as Field[]);
}

export function start(si: SnowIsland): Position {
  return { line: 0, char: si[0].findIndex((f) => f === ".") };
}

export function finish(si: SnowIsland): Position {
  return { line: si.length - 1, char: si[si.length - 1].findIndex((f) => f === ".") };
}

export function neighborFields(pos: Position, snowIsland: SnowIsland, isIcy: boolean): Position[] {
  const neighborFields = [];
  if (pos.line > 0 && (!isIcy || snowIsland[pos.line - 1][pos.char] !== "v")) neighborFields.push({ line: pos.line - 1, char: pos.char });
  if (pos.char > 0 && (!isIcy || snowIsland[pos.line][pos.char - 1] !== ">")) neighborFields.push({ line: pos.line, char: pos.char - 1 });
  if (pos.line < snowIsland.length - 1 && (!isIcy || snowIsland[pos.line + 1][pos.char] !== "^")) neighborFields.push({ line: pos.line + 1, char: pos.char });
  if (pos.char < snowIsland[0].length - 1 && (!isIcy || snowIsland[pos.line][pos.char + 1] !== "<")) neighborFields.push({ line: pos.line, char: pos.char + 1 });
  return neighborFields.filter((p) => snowIsland[p.line][p.char] !== "#");
}

export function longestPath(snowIsland: SnowIsland, isIcy: boolean = true): Position[] {
  const startPos = start(snowIsland);
  const finishPos = finish(snowIsland);

  function longestPathRec(nextPos: Position, pathSoFar: Position[]): Position[] | undefined {
    if (JSON.stringify(nextPos) === JSON.stringify(finishPos)) {
      return pathSoFar;
    } else if (pathSoFar.map((p) => JSON.stringify(p)).includes(JSON.stringify(nextPos))) {
      return undefined;
    } else {
      const pathsFromHere =
        neighborFields(nextPos, snowIsland, isIcy)
          .filter((np) => JSON.stringify(np) !== JSON.stringify(pathSoFar.at(-1))) // Can't go back
          .map((np) => longestPathRec(np, [...pathSoFar, nextPos]))
          .filter((pfh) => pfh !== undefined) as Position[][];
      if (pathsFromHere.length === 0) return;
      const maxPathLength = Math.max(...pathsFromHere.map((pfh) => pfh.length));
      return pathsFromHere.find((pfh) => pfh.length === maxPathLength)!;
    }
  }

  return longestPathRec(startPos, []) ?? [];
}

export function day23part1(input: string): number {
  return longestPath(parseInput(input)).length;
}

export function day23part2(input: string): number {
  return longestPath(parseInput(input), false).length;
}
