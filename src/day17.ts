type Puzzle = number[][];

interface Position {
  line: number;
  char: number;
}

type Heading = "Up" | "Down" | "Left" | "Right";

type HeatLosses = [number, Heading, number][][];

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

function* neighbors(puzzle: Puzzle, position: Position): Generator<[Position, Heading], void, unknown> {
  yield* nextPos(puzzle, position, "Up");
  yield* nextPos(puzzle, position, "Down");
  yield* nextPos(puzzle, position, "Left");
  yield* nextPos(puzzle, position, "Right");
}

function createHeatLosses(puzzle: Puzzle): HeatLosses {
  return Array(puzzle.length)
    .fill(undefined)
    .map(() =>
      Array(puzzle[0].length)
        .fill(undefined)
        .map(() => [Infinity, "Left", 0])
    );
}

function findHeatLosses(puzzle: Puzzle, start: Position): HeatLosses {
  interface State {
    pos: Position;
    heading: Heading;
    stepsLeft: number;
    heatLossSoFar: number;
  }

  const heatLosses = createHeatLosses(puzzle);

  const needToCalculate: State[] = [...neighbors(puzzle, start)]
    .map(([pos, heading]) => ({ pos, heading, stepsLeft: 2, heatLossSoFar: 0 }));

  while (needToCalculate.length > 0) {
    const currState = needToCalculate.pop()!;

    const currHeatLossSoFar = currState.heatLossSoFar + puzzle[currState.pos.line][currState.pos.char];

    const currStepsLeft = currState.stepsLeft;

    const [bestHeatLossValue, bestHeatLossDirection, bestHeatLossStepsLeft] =
      heatLosses[currState.pos.line][currState.pos.char];

    if (bestHeatLossValue > currHeatLossSoFar) {

      heatLosses[currState.pos.line][currState.pos.char] = [currHeatLossSoFar, currState.heading, currStepsLeft];

      const nextStates = [...neighbors(puzzle, currState.pos)]
        .map(([pos, heading]) => ({
          pos,
          heading,
          stepsLeft: heading === currState.heading ? currState.stepsLeft - 1 : 2,
          heatLossSoFar: currHeatLossSoFar
        }))
        .filter((st) => st.stepsLeft >= 0);
      
      needToCalculate.push(...nextStates);
    } else if ( // bestHeatLossValue <= currHeatLossSoFar
      bestHeatLossDirection === currState.heading && // if I'm heading the same direction
      currStepsLeft > 0 && // I have steps left
      bestHeatLossStepsLeft < currStepsLeft // previous min was reached with less steps remaining, than now
    ) {
      needToCalculate.push(...[...nextPos(puzzle, currState.pos, currState.heading)].map(([pos, _]) => ({
        pos,
        heading: currState.heading,
        stepsLeft: currState.stepsLeft - 1,
        heatLossSoFar: currHeatLossSoFar,
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