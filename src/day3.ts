export interface Position {
  line: number;
  char: number;
}

export type Map = string[][];

export function parseMap(input: string): Map {
  return input.split("\n").map((line) => line.split(""));
}

export function neighborPoses(pos: Position): Position[] {
  const diffs = [-1, 0, 1];
  
  return diffs
    .flatMap((lineDiff) =>
      diffs.map((charDiff) =>
        ({ line: pos.line + lineDiff, char: pos.char + charDiff })
      )
  ).filter((ps) =>
    (pos.line !== ps.line || pos.char !== ps.char)
  );
}

export function getCell(map: Map, pos: Position): string | undefined {
  if (pos.line >= map.length) return;
  if (pos.char >= map[0].length) return;
  if (pos.line < 0) return;
  if (pos.char < 0) return;
  return map[pos.line][pos.char];
}

export function asNumber(char: string): number | undefined {
  const charCode = char.charCodeAt(0) - "0".charCodeAt(0);
  if (0 <= charCode && charCode <= 9) {
    return charCode;
  } else {
    return;
  }
}

export function findPartNumbers(map: Map): number[] {
  function findPartNumbersInLine(line: string[], lineNo: number): number[] {
    function findPartNumbersInLineRec(char: number, acc: number[], numberSoFar: string[], hasNeighborSymbol: boolean): number[] {
      if (char === line.length) {
        if (numberSoFar.length > 0 && hasNeighborSymbol) {
          acc.push(parseInt(numberSoFar.join("")));
        }
        return acc;
      } else {
        const currChar = line[char];
        const asNum = asNumber(currChar);

        if (asNum === undefined) { // . or symbol
          if (numberSoFar.length > 0 && hasNeighborSymbol) {
            acc.push(parseInt(numberSoFar.join("")));
          }
          return findPartNumbersInLineRec(char + 1, acc, [], false);
        } else { // if (asNum !== undefined) {
          numberSoFar.push(currChar);

          const newHasNeighborSymbol = hasNeighborSymbol ||
            neighborPoses({ line: lineNo, char })
              .map((neighborPos) =>
                getCell(map, neighborPos))
              .filter((c) => c !== undefined)
              .find((c) => c !== "." && asNumber(c!) === undefined) !== undefined;
          
          return findPartNumbersInLineRec(char + 1, acc, numberSoFar, newHasNeighborSymbol);
        }
      }
    }

    return findPartNumbersInLineRec(0, [], [], false);
  }

  return map.flatMap((line, lineNo) => findPartNumbersInLine(line, lineNo));
}

export function day3part1(input: string): number {
  const map = parseMap(input);

  const partNumbers = findPartNumbers(map);

  return partNumbers.reduce((acc, curr) => acc + curr, 0);
}