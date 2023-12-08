import { writeFileSync } from "fs";

export interface MapNode {
  id: string;
  left: string;
  right: string;
}

type Map = Record<string, MapNode>;
type Instruction = "R" | "L";

export interface Puzzle {
  instructions: Instruction[];
  map: Map;
}

export function parseMap(lines: string[]): Map {
  return lines.reduce((prevMap, currLine) => {
    const [start, directions] = currLine.split(" = ");
    const [left, right] = directions.slice(1, -1).split(", ");
    prevMap[start] = { id: start, left, right };
    return prevMap;
  }, {} as Map);
}

export function parseInput(input: string): Puzzle {
  const lines = input.split("\n");

  return {
    instructions: [...lines[0]] as Instruction[],
    map: parseMap(lines.slice(2)),
  };
}

export function* instructions(puzzle: Puzzle): Generator<Instruction, never, any> {
  while (true) {
    yield* [...puzzle.instructions];
  }
}

function nextNode(currNode: string, map: Map, instruction: Instruction): string {
  switch (instruction) {
    case "R": {
      return map[currNode].right;
    }
    case "L": {
      return map[currNode].left;
    }
  }
}

function numberOfStepsNavigating(puzzle: Puzzle): number {
  const instr = instructions(puzzle);

  let stepsSoFar = 0;
  let currNode = "AAA";
  do {
    const instruction = instr.next().value;
    currNode = nextNode(currNode, puzzle.map, instruction);
    stepsSoFar++;
  } while (currNode !== "ZZZ");

  return stepsSoFar;
}

export function day8part1(input: string): number {
  const puzzle = parseInput(input);

  return numberOfStepsNavigating(puzzle);
}

function numberOfStepsNavigatingGhostly(puzzle: Puzzle): number {
  const inst = instructions(puzzle);
  let currNodes = Object.keys(puzzle.map).filter((n) => n.endsWith("A"));
  let lastAtZ = Array<Array<{ afterStep: number; node: string }>>(currNodes.length).fill([]).map(() => []);
  let stepsSoFar = 0;
  do {
    const instruction = inst.next().value;
    currNodes = currNodes.map((n, index) => {
      const nn = nextNode(n, puzzle.map, instruction);
      if (nn.endsWith("Z")) {
        lastAtZ[index].push({ afterStep: stepsSoFar, node: nn } as never);
      }
      return nn;
    });
    stepsSoFar++;
  } while (!currNodes.every((n) => n.endsWith("Z")) && stepsSoFar < 1_000_000);

  writeFileSync("./cycles.json", JSON.stringify(lastAtZ, undefined, 2));

  return stepsSoFar;
}

export function day8part2(input: string): number {
  const puzzle = parseInput(input);

  return numberOfStepsNavigatingGhostly(puzzle);
}