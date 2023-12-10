type Cell = "|" | "-" | "L" | "J" | "7" | "F" | "." | "S";
type Direction = "S" | "N" | "E" | "W";

export interface Coords {
  line: number;
  char: number;
}

export interface Map {
  start: Coords;
  lines: Cell[][];
}

export function parseInput(input: string): Map {
  let start: Coords = { line: -1, char: -1 };
  
  const lines = input.split("\n").map((line, lineNum) => [...line].map((char, charNum) => {
    const charAsCell = char as Cell;
    if (charAsCell === "S") {
      start = { line: lineNum, char: charNum };
    }
    return charAsCell;
  }));
  
  return { start, lines };
}

type Distances = Array<number | undefined>[];

export interface State {
  pos: Coords;
  heading: Direction;
  distance: number;
  inside: "toRight" | "toLeft" | undefined;
}

function nextPos(pos: Coords, heading: Direction, map: Map): Coords | undefined {
  switch (heading) {
    case "S": return pos.line < map.lines.length - 1 ? { line: pos.line + 1, char: pos.char } : undefined;
    case "N": return pos.line > 0 ? { line: pos.line - 1, char: pos.char } : undefined;
    case "E": return pos.char < map.lines[0].length - 1 ? { line: pos.line, char: pos.char + 1 } : undefined;
    case "W": return pos.char > 0 ? { line: pos.line, char: pos.char - 1 } : undefined;
  }
}

function nextHeading(heading: Direction, pos: Coords, map: Map): Direction | undefined {
  const cell = map.lines[pos.line][pos.char];

  switch (heading) {
    case "N": {
      switch (cell) {
        case "7": return "W";
        case "F": return "E";
        case "|": return "N";
        default: return;
      };
    };
    case "S": {
      switch (cell) {
        case "J": return "W";
        case "L": return "E";
        case "|": return "S";
        default: return;
      };
    };
    case "E": {
      switch (cell) {
        case "-": return "E";
        case "7": return "S";
        case "J": return "N";
        default: return;
      };
    };
    case "W": {
      switch (cell) {
        case "-": return "W";
        case "F": return "S";
        case "L": return "N";
        default: return;
      };
    };
  }
}

function nextState(state: State, map: Map): State | undefined {
  const nPos = nextPos(state.pos, state.heading, map);

  if (nPos === undefined) return;

  const nHeading = nextHeading(state.heading, nPos, map);

  if (nHeading === undefined) return;

  return { pos: nPos, heading: nHeading, distance: state.distance + 1, inside: state.inside };
}

function coordInside(state: State, map: Map): Coords | undefined {
  const { line, char } = state.pos;

  switch (state.heading) {
    case "E": {
      if (state.inside === "toLeft") {
        return line > 0 ? { line: line - 1, char } : undefined;
      } else {
        return line < map.lines.length - 1 ? { line: line + 1, char } : undefined;
      }
    }
    case "W": {
      if (state.inside === "toLeft") {
        return line < map.lines.length - 1 ? { line: line + 1, char } : undefined;
      } else {
        return line > 0 ? { line: line - 1, char } : undefined;
      }
    }
    case "N": {
      if (state.inside === "toLeft") {
        return char > 0 ? { line, char: char - 1 } : undefined;
      } else {
        return char < map.lines[0].length - 1 ? { line, char: char + 1 } : undefined;
      }
    }
    case "S": {
      if (state.inside === "toLeft") {
        return char < map.lines[0].length - 1 ? { line, char: char + 1 } : undefined;
      } else {
        return char > 0 ? { line, char: char - 1 } : undefined;
      }
    }
  }
}

export function findDistances(map: Map): [Distances, Coords[]] {
  const distances = Array(map.lines.length).fill(undefined).map(() => Array(map.lines[0].length).fill(Infinity));

  distances[map.start.line][map.start.char] = 0;

  const needToFill: Coords[] = [];
  const needToVisit: State[] = [
    nextState({pos: map.start, heading: "E", distance: 0, inside: undefined}, map),
    nextState({pos: map.start, heading: "W", distance: 0, inside: "toLeft"}, map),
    nextState({pos: map.start, heading: "S", distance: 0, inside: "toRight"}, map),
    nextState({pos: map.start, heading: "N", distance: 0, inside: undefined}, map),
  ].filter((s) => s !== undefined) as State[];

  while (needToVisit.length > 0) {
    const state = needToVisit.pop() as State;
    
    if (distances[state.pos.line][state.pos.char] <= state.distance) {
      continue;
    }

    distances[state.pos.line][state.pos.char] = state.distance;

    if (state.inside !== undefined) {
      const coordToFill = coordInside(state, map);
      if (coordToFill !== undefined) {
        needToFill.push(coordToFill);
      }
    }

    const nst = nextState(state, map);

    if (nst !== undefined) {
      needToVisit.push(nst);
    }
  }

  return [distances, needToFill];
}

export function day10part1(input: string): number {
  return Math.max(...(findDistances(parseInput(input))[0].flatMap((l) => l.flatMap(c => c)).filter((c) => c !== Infinity)) as number[]);
}

function* allNeighbors(coords: Coords, distances: Distances) {
  function* allNeighborsInLine([cl, cc]: [number, number], distances: Distances) {
    if (cc > 0) {
      yield { line: cl, char: cc - 1 };
    }
    if (cl !== currLine || cc !== currChar) {
      yield { line: cl, char: cc };
    }
    if (cc < distances[0].length - 1) {
      yield { line: cl, char: cc + 1 };
    }
  }
  
  const { line: currLine, char: currChar } = coords;
  if (currLine > 0) {
    yield* allNeighborsInLine([currLine - 1, currChar], distances);
  }
  yield* allNeighborsInLine([currLine, currChar], distances);
  if (currLine < distances.length - 1) {
    yield* allNeighborsInLine([currLine + 1, currChar], distances);
  }
}

function fill(distances: Distances, needToFill: Coords[]): Distances {
  while (needToFill.length > 0) {
    const ntf = needToFill.pop();
    const { line, char } = ntf!;

    if (distances[line][char] !== Infinity) {
      continue;
    } else {
      distances[line][char] = -1;
    }

    needToFill.push(...[...allNeighbors(ntf!, distances)].filter(({ line: l, char: c }) => l !== line || c !== char));
  }

  return distances;
}

function show(distances: Distances): string {
  return distances.reduce((prevStr, currLine) => {
    return `${prevStr}${currLine.map((c) => {
      if (c === Infinity) {
        return "o";
      } else if (c === -1) {
        return "#";
      } else {
        return [...`${c}`].at(-1);
      }
    }).join("")}\n`
  }, "");
}

export function day10part2(input: string): number {
  const [distances, toFill] = findDistances(parseInput(input));
  const filled = fill(distances, toFill);

  const sh = show(filled);

  return filled.flatMap((l) => l.flatMap(c => c)).filter((c) => c === -1).length;
}
