export type Puzzle = string[][];

export function transpose<T>(a: T[][]): T[][] {
  return a[0].map((_, colIndex) => a.map(row => row[colIndex]));
}

export function parseInput(input: string): Puzzle {
  return input.split("\n").map((l) => [...l]);
}

export function loadOfLine(line: string[]): number {
  return line.reduce((prevState, currItem, currIndex) => { 
    switch (currItem) {
      case "#": return { load: prevState.load, lastOccupiedPos: currIndex };
      case "O": return { load: prevState.load + (line.length - (prevState.lastOccupiedPos + 1)), lastOccupiedPos: prevState.lastOccupiedPos + 1 };
      default: return prevState;
    }
  }, {
    load: 0,
    lastOccupiedPos: -1,
  }).load;
}

export function load(puzzle: Puzzle): number {
  return puzzle.map(loadOfLine).reduce((a, b) => a + b);
}

export function day14part1(input: string): number {
  return load(transpose(parseInput(input)));
}

export function rotateLeft(puzzle: Puzzle): Puzzle {
  return puzzle[0].map((_, index) => puzzle.map(row => row[row.length-1-index]));
}

const rotateRightMemo: Map<string, string> = new Map();

type Puzzle2 = string;

export function rotateRight(puzzle: Puzzle2): Puzzle2 {
  if (!rotateRightMemo.has(puzzle)) {
    const puzzleParsed = parseInput(puzzle);
    rotateRightMemo.set(puzzle, toString(puzzleParsed.map((_, index) => puzzleParsed.map(row => row[index]).reverse())));
  }
  return rotateRightMemo.get(puzzle)!;
}

const tiltMemo: Map<string, string> = new Map();

function calcTiltLeftLine(line: string[]): string[] {
  interface State {
    strSoFar: string[];
    lastOccupiedPos: number;
  }
  const tilted = line.reduce((prevState, currItem, index) => {
    switch (currItem) {
      case "#": return {
        strSoFar: [...prevState.strSoFar, ...".".repeat(index - prevState.lastOccupiedPos - 1), "#"],
        lastOccupiedPos: index,
      };
      case "O": return {
        strSoFar: [...prevState.strSoFar, "O"],
        lastOccupiedPos: prevState.lastOccupiedPos + 1
      };
      default: return prevState; // "."
    }
  },
    {
      strSoFar: [],
      lastOccupiedPos: -1,
    } as State).strSoFar;
  
  for (let i = tilted.length; i < line.length; i++) {
    tilted[i] = ".";
  }

  return tilted;
}

function calcTiltLeft(puzzle: Puzzle): Puzzle {
  return puzzle.map(calcTiltLeftLine);
}

function toString(puzzle: Puzzle): string {
  return puzzle.map((l) => l.join("")).join("\n");
}

export function tiltLeft(puzzle: Puzzle2): Puzzle2 {
  if (!tiltMemo.has(puzzle)) {
    const puzzleParsed = parseInput(puzzle);
    tiltMemo.set(puzzle, toString(calcTiltLeft(puzzleParsed)));
  }
  return tiltMemo.get(puzzle)!;
}

export function loadOfLine2(line: string[]): number {
  return line.reduce((prevLoad, currItem, index) => {
    if (currItem === "O") {
      return prevLoad + line.length - index;
    } else {
      return prevLoad;
    }
  }, 0);
}

export function load2(puzzle: Puzzle): number {
  return puzzle.map(loadOfLine2).reduce((a, b) => a + b);
}

const cycleMemo: Map<string, string> = new Map();

export function cycle(puzzle: Puzzle2): Puzzle2 {
  // Assuming that North is to the left
  if (!cycleMemo.has(puzzle)) {
    cycleMemo.set(puzzle, rotateRight( // Left is north
      tiltLeft( // Rocks roll east
        rotateRight( // Left is east
          tiltLeft( // Rocks roll south
            rotateRight( // Left is south
              tiltLeft( // Rocks roll west
                rotateRight( // Left is west
                  tiltLeft(puzzle) // Rocks roll north
                )
              )
            )
          )
        )
      )
    ));
  }
  return cycleMemo.get(puzzle)!;
}

export function day14part2(input: string, rounds = 1000000000): number {
  let puzzle = toString(rotateLeft(parseInput(input)));

  for (let i = 0; i < rounds; i++) {
    puzzle = cycle(puzzle);
  }

  return load2(parseInput(rotateRight(puzzle)));
}