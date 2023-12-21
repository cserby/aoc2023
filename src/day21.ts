interface Position {
  line: number;
  char: number;
}

interface Puzzle {
  fields: string[][];
  start: Position;
}

export function parseInput(input: string): Puzzle {
  const fields = input.split("\n").map((l) => [...l]);

  const start = fields
    .map((l, lineIndex) => ({ line: lineIndex, char: l.findIndex((f) => f === "S") }))
    .filter((p) => p.char !== -1)[0];

  return {
    fields,
    start,
  }
}

export function neighborFields(pos: Position, puzzle: Puzzle): Position[] {
  const neighborFields = [];
  if (pos.line > 0) neighborFields.push({ line: pos.line - 1, char: pos.char });
  if (pos.char > 0) neighborFields.push({ line: pos.line, char: pos.char - 1 });
  if (pos.line < puzzle.fields.length - 1) neighborFields.push({ line: pos.line + 1, char: pos.char });
  if (pos.char < puzzle.fields[0].length - 1) neighborFields.push({ line: pos.line, char: pos.char + 1 });
  return neighborFields.filter((p) => puzzle.fields[p.line][p.char] !== "#");
}

export function canGoTo(from: Position, puzzle: Puzzle, steps: number): string[] {
  if (steps === 0) {
    return [JSON.stringify(from)];
  } else {
    return neighborFields(from, puzzle).map((n) => canGoTo(n, puzzle, steps - 1)).reduce((prevSet, currSet) => {
      for (const posStr of currSet) {
        if (!prevSet.includes(posStr)) {
          prevSet.push(posStr);
        }
      }
      return prevSet;
    }, []);
  }
}

export function day21part1(input: string, steps: number = 64): number {
  const puzzle = parseInput(input);
  
  let cgt = [JSON.stringify(puzzle.start)];

  for (let i = 0; i < steps; i++) {
    cgt = [...new Set(cgt.flatMap((p) => neighborFields(JSON.parse(p), puzzle).map((nf) => JSON.stringify(nf))))];
  }

  return cgt.length;
}
