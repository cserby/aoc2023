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

export function day21part1(input: string, steps: number = 64): number {
  const puzzle = parseInput(input);
  
  let cgt = [JSON.stringify(puzzle.start)];

  for (let i = 0; i < steps; i++) {
    cgt = [...new Set(cgt.flatMap((p) => neighborFields(JSON.parse(p), puzzle).map((nf) => JSON.stringify(nf))))];
  }

  return cgt.length;
}

export function neighborFields2(pos: Position, puzzle: Puzzle): Position[] {
  const neighborFields = [];
  neighborFields.push({ line: pos.line - 1, char: pos.char });
  neighborFields.push({ line: pos.line, char: pos.char - 1});
  neighborFields.push({ line: pos.line + 1, char: pos.char });
  neighborFields.push({ line: pos.line, char: pos.char + 1 });
  return neighborFields
    .filter((p) =>
      puzzle.fields[(p.line + (p.line < 0 ? (Math.abs(Math.floor(p.line / puzzle.fields.length)) * puzzle.fields.length) : 0)) % puzzle.fields.length][(p.char + (p.char < 0 ? (Math.abs(Math.floor(p.char / puzzle.fields[0].length)) * puzzle.fields[0].length) : 0)) % puzzle.fields[0].length] !== "#");
}

export function day21part2(input: string, steps: number = 26501365): number {
  const puzzle = parseInput(input);
  
  let cgt = [JSON.stringify(puzzle.start)];

  for (let i = 0; i < steps; i++) {
    cgt = [...new Set(cgt.flatMap((p) => neighborFields2(JSON.parse(p), puzzle).map((nf) => JSON.stringify(nf))))];
  }

  return cgt.length;
}
