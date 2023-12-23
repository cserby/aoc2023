type Field = "." | "#" | ">" | "<" | "v" | "^";

type SnowIsland = Field[][];

interface Position {
  line: number;
  char: number;
}

import { error } from "console";

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

export function longestPath(snowIsland: SnowIsland, isIcy: boolean = true): number {
  const startPos = start(snowIsland);
  const finishPos = finish(snowIsland);

  function longestPathRec(nextPos: Position, pathSoFar: string[]): string[] | undefined {
    let currPos = nextPos;
    let currPathSoFar = JSON.parse(JSON.stringify(pathSoFar)) as string[];

    // show(snowIsland, currPathSoFar.map((p) => JSON.parse(p)));
    // error("\n");

    while (true) {      
      if (JSON.stringify(currPos) === JSON.stringify(finishPos)) {
        return currPathSoFar;
      } else {
        const nextPoses = neighborFields(currPos, snowIsland, isIcy)
          .filter((np) => JSON.stringify(currPathSoFar.at(-1)) !== JSON.stringify(np)) // Can't turn back
          .filter((np) => !currPathSoFar.includes(JSON.stringify(np))); // No cycles
        if (nextPoses.length === 0) {
          return undefined;
        } else if (nextPoses.length === 1) {
          currPathSoFar.push(JSON.stringify(currPos));
          currPos = nextPoses[0];
          continue;
        } else {
          const pathsFromHere = nextPoses
            .map((np) => longestPathRec(np, [...currPathSoFar, JSON.stringify(currPos)]))
            .filter((pfh) => pfh !== undefined) as string[][];
          if (pathsFromHere.length === 0) return;
          const maxPathLength = Math.max(...pathsFromHere.map((pfh) => pfh.length));
          return pathsFromHere.find((pfh) => pfh.length === maxPathLength)!;
        }
      }
    }
  }

  return longestPathRec(startPos, [])?.length ?? -1;
}

function show(snowIsland: SnowIsland, path: Position[]) {
  const pathJsons = path.map((p) => JSON.stringify(p));
  const str = snowIsland
    .map((l, lineIndex) => l
      .map((c, charIndex) =>
        pathJsons.includes(JSON.stringify({ line: lineIndex, char: charIndex })) ? "O" : c
      ).join("")
  ).join("\n");
  
  error(str);
}

export function day23part1(input: string): number {
  return longestPath(parseInput(input));
}

export function day23part2(input: string): number {
  return longestPath(parseInput(input), false);
}
