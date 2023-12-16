type Field = "." | "|" | "-" | "/" | "\\";

type Heading = "Up" | "Down" | "Left" | "Right";

interface Position {
  line: number;
  char: number;
}

interface Puzzle {
  field: Field[][]
}

interface Energized {
  field: Heading[][][];
}

interface RayStart {
  position: Position;
  heading: Heading;
}

export function parseInput(input: string): Puzzle {
  return {
    field: input.split("\n").map((l) => [...l] as Field[]),
  };
}

function createEnergized(puzzle: Puzzle): Energized {
  return {
    field: Array(puzzle.field.length)
      .fill(undefined)
      .map((_) => Array(puzzle.field[0].length)
        .fill(undefined)
        .map((_) => [] as Heading[])
      ),
  }
}

function nextPosition(puzzle: Puzzle, position: Position, heading: Heading): Position | undefined {
  switch (heading) {
    case "Down": return (position.line < puzzle.field.length - 1) ? { line: position.line + 1, char: position.char } : undefined;
    case "Up": return (position.line > 0) ? { line: position.line - 1, char: position.char } : undefined;
    case "Left": return (position.char > 0) ? { line: position.line, char: position.char - 1 } : undefined;
    case "Right": return (position.char < puzzle.field[0].length - 1) ? { line: position.line, char: position.char + 1 } : undefined;
  }
}

export function rayTrace(puzzle: Puzzle, energized: Energized, rayStart: RayStart): [Energized, RayStart[]] {
  let currPos: Position | undefined = rayStart.position;
  let currHeading = rayStart.heading;

  while (currPos !== undefined) {
    if (energized.field[currPos.line][currPos.char].includes(currHeading)) { // Cycle
      return [energized, []];
    } else {
      energized.field[currPos.line][currPos.char].push(currHeading);

      switch (puzzle.field[currPos.line][currPos.char]) {
        case ".": {
          currPos = nextPosition(puzzle, currPos, currHeading);
          // currHeading = currHeading;
          break;
        }
        case "\\": {
          switch (currHeading) {
            case "Down": { currHeading = "Right"; break; }
            case "Up": { currHeading = "Left"; break; }
            case "Left": { currHeading = "Up"; break; }
            case "Right": { currHeading = "Down"; break; }
          }
          currPos = nextPosition(puzzle, currPos, currHeading);
          break;
        }
        case "/": {
          switch (currHeading) {
            case "Down": { currHeading = "Left"; break; }
            case "Up": { currHeading = "Right"; break; }
            case "Left": { currHeading = "Down"; break; }
            case "Right": { currHeading = "Up"; break; }
          }
          currPos = nextPosition(puzzle, currPos, currHeading);
          break;
        }
        case "-": {
          switch (currHeading) {
            case "Down": case "Up": { return [energized, [{ position: currPos!, heading: "Left" }, { position: currPos!, heading: "Right" }]]; }
            default: { currPos = nextPosition(puzzle, currPos, currHeading); break; }
          }
          break;
        }
        case "|": {
          switch (currHeading) {
            case "Left": case "Right": { return [energized, [{ position: currPos!, heading: "Up" }, { position: currPos!, heading: "Down" }]]; }
            default: { currPos = nextPosition(puzzle, currPos, currHeading); break; }
          }
          break;
        }
      }
    }
  }

  return [energized, []];
}

export function rayTraceFromStart(puzzle: Puzzle, rayStart: RayStart): Energized {
  const raysToTrace: RayStart[] = [rayStart];

  let energized = createEnergized(puzzle);

  while (raysToTrace.length > 0) {
    const [newEnergized, newRaysToTrace] = rayTrace(puzzle, energized, raysToTrace.pop()!);
    energized = newEnergized;
    raysToTrace.push(...newRaysToTrace);
  }

  return energized;
}

export function rayTraceFromTopLeft(puzzle: Puzzle): Energized {
  return rayTraceFromStart(puzzle, {
    position: {
      line: 0,
      char: 0,
    },
    heading: "Right"
  });
}

function countEnergized(energized: Energized): number {
  return energized.field
    .map((l) =>
      l.reduce((prevNonEmpty, f) =>
        prevNonEmpty + (f.length === 0 ? 0 : 1),
        0
      )
    )
    .reduce((a, b) => a + b, 0);
}

export function day16part1(input: string): number {
  return countEnergized(rayTraceFromTopLeft(parseInput(input)));
}

export function day16part2(input: string): number {
  const puzzle = parseInput(input);

  return Math.max(...[
    ...Array(puzzle.field.length).fill(undefined).map((_, lineNo) => ({
      position: {
        line: lineNo,
        char: 0,
      },
      heading: "Right",
    })) as RayStart[], // fromLeft
    ...Array(puzzle.field.length).fill(undefined).map((_, lineNo) => ({
      position: {
        line: lineNo,
        char: puzzle.field[0].length - 1,
      },
      heading: "Left",
    })) as RayStart[], // fromRight
    ...Array(puzzle.field[0].length).fill(undefined).map((_, charNo) => ({
      position: {
        line: 0,
        char: charNo,
      },
      heading: "Down",
    })) as RayStart[], // fromUp
    ...Array(puzzle.field[0].length).fill(undefined).map((_, charNo) => ({
      position: {
        line: puzzle.field.length - 1,
        char: charNo,
      },
      heading: "Up",
    })) as RayStart[], // fromUp
  ].map((rs) => countEnergized(rayTraceFromStart(puzzle, rs))));
}