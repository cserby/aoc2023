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

function numberOfStepsNavigating(map: Map, instructions: Generator<Instruction, never, any>, startNode: string, endNode: string): number {
  // function navigateRec(currNode: string, stepsSoFar: number): number {
  //   if (currNode === endNode) return stepsSoFar;
  //   else {
  //     const instruction = instructions.next();
  //     switch (instruction.value) {
  //       case "R": return navigateRec(map[currNode].right, stepsSoFar + 1);
  //       case "L": return navigateRec(map[currNode].left, stepsSoFar + 1);
  //     }
  //   }
  // }
  //
  //return navigateRec(startNode, 0);

  let stepsSoFar = 0;
  let currNode = startNode;
  do {
    const instruction = instructions.next();
    switch (instruction.value) {
      case "R": {
        currNode = map[currNode].right; break;
      }
      case "L": {
        currNode = map[currNode].left; break;
      }
    }
    stepsSoFar++;
  } while (currNode !== endNode);

  return stepsSoFar;
}

export function day8part1(input: string): number {
  const puzzle = parseInput(input);

  return numberOfStepsNavigating(puzzle.map, instructions(puzzle), "AAA", "ZZZ");
}