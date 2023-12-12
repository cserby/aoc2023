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
  function rlrec(fieldsLeft: string[], inRun: boolean, currRunLen: number, prevRunLens: number[]): number[] {
    const [head, ...tail] = fieldsLeft;

    if (head === undefined) { // end of string
      if (inRun) {
        return [...prevRunLens, currRunLen];
      } else {
        return prevRunLens;
      }
    } else if (head === "#") {
      if (inRun) {
        return rlrec(tail, true, currRunLen + 1, prevRunLens);
      } else {
        return rlrec(tail, true, 1, prevRunLens);
      }
    } else { // "?" or "."
      if (inRun) {
        return rlrec(tail, false, 0, [...prevRunLens, currRunLen]);
      } else {
        return rlrec(tail, false, 0, prevRunLens);
      }
    }
  }

  return rlrec(fields, false, 0, []);
}

function isSolution(fields: string[], arr: Arrangement): boolean {
  return fields.find((f) => f === "?") !== undefined || JSON.stringify(runLengths(fields)) === JSON.stringify(arr.runLengths);
}

export function possibleSolutions(arr: Arrangement): string[] {
  function psrec(fields: string[], decidedFields: string[]): string[] {
    const [head, ...tail] = fields;

    if (head === undefined) {
      return isSolution(decidedFields, arr) ? [decidedFields.join("")] : [];
    } else if (head === "." || head === "#") {
      return psrec(tail, [...decidedFields, head]);
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