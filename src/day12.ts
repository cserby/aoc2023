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

export function day12part1(input: string): number {
  return parseInput(input).map(possibleSolutions2).reduce((a, b) => a + b);
}

const memo: Record<string, number> = {};

function numberOfPossibleSolutionsMemo(fields: string[], runLengths: number[]): number {
  const memoKey = `${fields} ${JSON.stringify(runLengths)}`;
  if (!memo.hasOwnProperty(memoKey)) {
    memo[memoKey] = calculateNumberOfPossibilities(fields, runLengths);
  }
  return memo[memoKey];
}

function validTry(tryFields: string[], fields: string[]): boolean {
  for (let i = 0; i < tryFields.length; i++) {
    if (fields[i] === "?" || tryFields[i] === fields[i]) {
      continue;
    }
    return false;
  }
  return true;
}

function calculateNumberOfPossibilities(fields: string[], runLengths: number[]): number {
  if (runLengths.length === 0) {
    return fields.every((f) => f === "?" || f === ".") ? 1 : 0;
  } else {
    const [head, ...tail] = runLengths;

    let possibilities = 0;

    const minSpaceNeededForTail = tail.length === 0 ? 0 : tail.reduce((a, b) => a + b, 0) + tail.length;
    const maxSpaceForHead = fields.length - minSpaceNeededForTail;
    const maxDotsBeforeHead = maxSpaceForHead - head;

    for (let i = 0; i <= maxDotsBeforeHead; i++) {
      const tryFields = [
        ...".".repeat(i).split(""),
        ..."#".repeat(head).split(""),
        ...(tail.length === 0 ? [] : ["."])
      ];
      if (!validTry(tryFields, fields.slice(undefined, tryFields.length))) {
        continue;
      } else {
        possibilities += numberOfPossibleSolutionsMemo(fields.slice(tryFields.length), tail);
      }
    }

    return possibilities;
  }
}

export function possibleSolutions2(arr: Arrangement): number {
  /*const domains = arr.fields.join("").split(/[.]+/).map((d) => [...d]).filter((d) => d.length !== 0);
  
  let possibilities = 0;

  outer: for (const runLengthsSplit of allPossibleSplits(arr.runLengths, domains.length)) {
    let product = 1;
    for (let i = 0; i < runLengthsSplit.length; i++) {
      const poss = numberOfPossibleSolutionsMemo(domains[i], runLengthsSplit[i]);
      if (poss === 0) {
        product = 0;
        continue outer;
      } else {
        product *= poss;
      }
    }
    possibilities += product;
  }*/

  return numberOfPossibleSolutionsMemo(arr.fields, arr.runLengths);
}

export function* allPossibleSplits<T>(array: T[], numSplits: number): Generator<Array<T[]>, void, unknown> {
  function* allPossibleSplitsGen(array: T[], numSplits: number, prepend: Array<T[]>): Generator<Array<T[]>, void, unknown> {
    if (numSplits === 1) {
      yield [...prepend, array];
    } else {
      for (let i = 0; i <= array.length; i++) {
        yield* allPossibleSplitsGen(array.slice(i), numSplits - 1, [...prepend, array.slice(undefined, i)]);
      }
    }
  }

  yield* allPossibleSplitsGen(array, numSplits, []);
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
