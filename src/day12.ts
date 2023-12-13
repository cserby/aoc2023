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

function isSolution(fields: string[], arr: Arrangement): boolean {
  return fields.find((f) => f === "?") !== undefined || JSON.stringify(runLengths(fields)) === JSON.stringify(arr.runLengths);
}

function arrayStartsWith<T>(compareTo: T[], compared: T[]): boolean {
  for (let i = 0; i < compared.length; i++) {
    if (compareTo[i] !== compared[i]) {
      return false;
    }
  }

  return true;
}

function canBeSolution(solutionFields: string[], fields: string[], runLgths: number[]): boolean {
  const sureRunLengths = runLengths(solutionFields);
  const unsureRunLengths = runLgths.slice(sureRunLengths.length);
  if (fields.reduce((crossCount, field) => {
    if (field === "#") {
      return crossCount + 1;
    } else {
      return crossCount;
    }
  }, 0) > unsureRunLengths.reduce((prev, curr) => prev + curr, 0) + runLgths.length - 1) {
    // Less runs then #
    return false;
  } else if (fields.reduce((crossQmarkCount, field) => {
    if (field === "#" || field === "?") {
      return crossQmarkCount + 1;
    } else {
      return crossQmarkCount;
    }
  }, 0) < unsureRunLengths.reduce((prev, curr) => prev + curr, 0)) {
    // Less ? + # then runs
    return false;
  } else if (sureRunLengths.length === 0) {
    return true;
  } else if (sureRunLengths.length === 1) {
    return sureRunLengths[0] <= runLgths[0];
  } else {
    return arrayStartsWith(runLgths, sureRunLengths.slice(undefined, -1)) &&
      sureRunLengths[sureRunLengths.length - 1] <= runLgths[sureRunLengths.length - 1]; /* &&
      runLgths.slice(sureRunLengths.length).reduce((a, b) => a + b, 0)
       + unsureRunLengths.length - 1 <= fields.slice(solutionFields.length).filter((f) => f === "?" || f === "#").length; */
  }
}

function isASolution(solutionFields: string[], runLgths: number[]): boolean {
  return JSON.stringify(runLengths(solutionFields)) === JSON.stringify(runLgths);
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

    if (head === undefined) {
      return isSolution(decidedFields, arr) ? [decidedFields.join("")] : [];
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

export function possibleSolutions2(arr: Arrangement): number {
  const memo: Record<string, number> = {};

  function possibleSolutionsMemo(fields: string[], runLengths: number[]): number {
    const memoKey = `${fields.join("")} ${JSON.stringify(runLengths)}`;
    if (!memo.hasOwnProperty(memoKey)) {
      memo[memoKey] = possibleSolutionsRec(fields, runLengths, []);
    }
    return memo[memoKey];
  }

  function possibleSolutionsRec(fields: string[], runLengths: number[], decidedFields: string[]): number {
    const [head, ...tail] = fields;

    if (!canBeSolution(decidedFields, fields, runLengths)) {
      return 0;
    } else if (head === undefined) {
      return isASolution(decidedFields, runLengths) ? 1 : 0;
    } else if (head === "." || head === "#") {
      const [sure, unsure] = takeWhileSure(fields);
      return possibleSolutionsRec(unsure, runLengths, [...decidedFields, ...sure]);
    } else if (head === "?") {
      return possibleSolutionsRec(tail, runLengths, [...decidedFields, "."]) +
        possibleSolutionsRec(tail, runLengths, [...decidedFields, "#"]);
    } else {
      throw new Error("Unkown char");
    }
  }

  const domains = arr.fields.join("").split(/[.]+/).map((d) => [...d]).filter((d) => d.length !== 0);
  const runLengthsSplits = [...allPossibleSplits(arr.runLengths, domains.length)];

  return runLengthsSplits.reduce((currSum, currSplit) => {
    return currSum + currSplit.reduce((prevPossibilities, currRunLengths, index, _array) => {
      return prevPossibilities * possibleSolutionsMemo(domains[index], currRunLengths);
    }, 1)
  }, 0);
}

export function* allPossibleSplits<T>(array: T[], numSplits: number): Generator<Array<T[]>, void, unknown> {
  function* allPossibleSplitsGen(array: T[], numSplits: number, prepend: Array<T[]>): Generator<Array<T[]>, void, unknown> {
    if (numSplits > array.length) {
      return;
    } else if (numSplits === 1) {
      yield [...prepend, array];
    } else {
      for (let i = 1; i <= array.length; i++) {
        yield* allPossibleSplitsGen(array.slice(i), numSplits - 1, [...prepend, array.slice(undefined, i)]);
      }
    }
  }

  yield* allPossibleSplitsGen(array, numSplits, []);
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
    .map(possibleSolutions2)
    .reduce((a, b, _array) => a + b);
}
