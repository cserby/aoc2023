interface Arrangement {
  fields: string[];
  runLengths: number[];
}

function parseArrangement(line: string): Arrangement {
  const [fieldsStr, runLengthsStr] = line.split(" ");

  return {
    fields: [...fieldsStr],
    runLengths: runLengthsStr.split(",").map((n) => parseInt(n)),
  }
}

export function parseInput(input: string): Arrangement[] {
  return input.split("\n").map(parseArrangement);
}

export function runLengths(fields: string[]): number[] {
  return fields.join("").split(/[.?]/).map((s) => s.length).filter((l) => l !== 0);
}

function arrayStartsWith<T>(compareTo: T[], compared: T[]): boolean {
  for (let i = 0; i < compared.length; i++) {
    if (compareTo[i] !== compared[i]) {
      return false;
    }
  }

  return true;
}

function canBeSolution(fields: string[], arr: Arrangement): boolean {
  const sureRunLengths = runLengths(fields);
  if (sureRunLengths.length === 0) {
    return true;
  } else if (sureRunLengths.length === 1) {
    return sureRunLengths[0] <= arr.runLengths[0];
  } else {
    return arrayStartsWith(arr.runLengths, sureRunLengths.slice(undefined, -1)) &&
      sureRunLengths[sureRunLengths.length - 1] <= arr.runLengths[sureRunLengths.length - 1] &&
      arr.runLengths.slice(sureRunLengths.length).reduce((a, b) => a + b, 0) <= arr.fields.slice(fields.length).filter((f) => f === "?" || f === "#").length;
  }
}

function isASolution(fields: string[], arr: Arrangement): boolean {
  return JSON.stringify(runLengths(fields)) === JSON.stringify(arr.runLengths);
}

function takeWhileSure(fields: string[]): [string[], string[]] {
  const unsureIndex = fields.indexOf("?");

  if (unsureIndex === -1) {
    return [fields, []];
  } else {
    return [fields.slice(undefined, unsureIndex), fields.slice(unsureIndex, undefined)];
  }
}

export function possibleSolutions(arr: Arrangement): string[] {
  function psrec(fields: string[], decidedFields: string[]): string[] {
    const [head, ...tail] = fields;

    if (!canBeSolution(decidedFields, arr)) {
      return [];
    } else if (head === undefined) {
      return isASolution(decidedFields, arr) ? [decidedFields.join("")] : [];
    } else if (head === "." || head === "#") {
      const [sure, unsure] = takeWhileSure(fields);
      return psrec(unsure, [...decidedFields, ...sure]);
    } else if (head === "?") {
      return [
        ...psrec(tail, [...decidedFields, "."]),
        ...psrec(tail, [...decidedFields, "#"]),
      ];
    } else {
      throw new Error("Unkown char");
    }
  }

  return psrec(arr.fields, []);
}

export function day12part1(input: string): number {
  return parseInput(input).map(possibleSolutions).map((ps) => ps.length).reduce((a, b) => a + b);
}

export function unfold(arr: Arrangement): Arrangement {
  return {
    fields: [
      ...arr.fields,
      "?",
      ...arr.fields,
      "?",
      ...arr.fields,
      "?",
      ...arr.fields,
      "?",
      ...arr.fields,
    ],
    runLengths: [
      ...arr.runLengths,
      ...arr.runLengths,
      ...arr.runLengths,
      ...arr.runLengths,
      ...arr.runLengths,
    ],
  };
}

export function day12part2(input: string): number {
  return parseInput(input)
    .map(unfold)
    .map(possibleSolutions)
    .map((ps) => ps.length)
    .reduce((a, b) => a + b);
}
