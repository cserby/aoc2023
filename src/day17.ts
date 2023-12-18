type Puzzle = number[][];

interface Position {
  line: number;
  char: number;
}

type Heading = "Up" | "Down" | "Left" | "Right";

type HeatLosses = [number, Heading | undefined, number, Position[]][][];

function parseInput(input: string): Puzzle {
  return input.split("\n").map((l) => [...l].map((n) => parseInt(n)));
}

function* nextPos(puzzle: Puzzle, position: Position, heading: Heading): Generator<[Position, Heading], void, unknown> {
  switch (heading) {
    case "Up": {
      if (position.line > 0) yield [{ line: position.line - 1, char: position.char }, "Up"];
      break;
    }
    case "Down": {
      if (position.line < puzzle.length - 1) yield [{ line: position.line + 1, char: position.char }, "Down"];
      break;
    }
    case "Left": {
      if (position.char > 0) yield [{ line: position.line, char: position.char - 1 }, "Left"];
      break;
    }
    case "Right": {
      if (position.char < puzzle[0].length - 1) yield [{ line: position.line, char: position.char + 1 }, "Right"];
      break;
    }
  }
}

function* neighbors(puzzle: Puzzle, position: Position, heading: Heading): Generator<[Position, Heading], void, unknown> {
  if (heading !== "Down") yield* nextPos(puzzle, position, "Up");
  if (heading !== "Up") yield* nextPos(puzzle, position, "Down");
  if (heading !== "Right") yield* nextPos(puzzle, position, "Left");
  if (heading !== "Left") yield* nextPos(puzzle, position, "Right");
}

function createHeatLosses(puzzle: Puzzle): HeatLosses {
  return Array(puzzle.length)
    .fill(undefined)
    .map(() =>
      Array(puzzle[0].length)
        .fill(undefined)
        .map(() => [Infinity, undefined, 0, []])
    );
}

function findHeatLosses(puzzle: Puzzle, start: Position): HeatLosses {
  interface State {
    pos: Position;
    heading: Heading;
    stepsLeft: number;
    heatLossSoFar: number;
    fromPoses: Position[];
  }

  const heatLosses = createHeatLosses(puzzle);

  const needToCalculate: State[] = [...neighbors(puzzle, start, "Right")]
    .map(([pos, heading]) => ({ pos, heading, stepsLeft: 2, heatLossSoFar: 0, fromPoses: [{ line: 0, char: 0 }] }));

  while (needToCalculate.length > 0) {
    const currState = needToCalculate.pop()!; // need to select with min

    const currHeatLossSoFar = currState.heatLossSoFar + puzzle[currState.pos.line][currState.pos.char];

    const [bestHeatLossValue, bestHeatLossDirection, bestHeatLossStepsLeft] =
      heatLosses[currState.pos.line][currState.pos.char];

    if (bestHeatLossValue > currHeatLossSoFar) {

      heatLosses[currState.pos.line][currState.pos.char] = [currHeatLossSoFar, currState.heading, currState.stepsLeft, [...currState.fromPoses, currState.pos]];

      const nextStates = [...neighbors(puzzle, currState.pos, currState.heading)]
        .map(([pos, heading]) => ({
          pos,
          heading,
          stepsLeft: heading === currState.heading ? currState.stepsLeft - 1 : 2,
          heatLossSoFar: currHeatLossSoFar,
          fromPoses: [...currState.fromPoses, currState.pos],
        }))
        .filter((st) => st.stepsLeft >= 0);
      
      needToCalculate.push(...nextStates);
    } else if ( // bestHeatLossValue <= currHeatLossSoFar
      bestHeatLossDirection === currState.heading && // if I'm heading the same direction
      currState.stepsLeft > 0 && // I have steps left
      bestHeatLossStepsLeft < currState.stepsLeft // previous min was reached with less steps remaining, than now
    ) {
      needToCalculate.push(...[...nextPos(puzzle, currState.pos, currState.heading)].map(([pos, _]) => ({
        pos,
        heading: currState.heading,
        stepsLeft: currState.stepsLeft - 1,
        heatLossSoFar: currHeatLossSoFar,
        fromPoses: [...currState.fromPoses, currState.pos]
      })));
    } else {
      continue;
    }
  }

  return heatLosses;
}

export function day17part1(input: string): number {
  const puzzle = parseInput(input);
  return findHeatLosses(puzzle, { line: 0, char: 0 })[puzzle.length - 1][puzzle[0].length - 1][0];
}