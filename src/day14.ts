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