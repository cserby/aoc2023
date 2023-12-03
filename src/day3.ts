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

export function readWhileNumber(from: string): string | undefined {
  return from.match(/^[0-9]+/)?.[0];
}

export function strReverse(str: string | undefined): string | undefined {
  if (str !== undefined) {
    return [...str].reverse().join("");
  } else {
    return;
  }
}

export function numbersAround(map: Map, lineNo: number, charNo: number): number[] {
  const numbers = [] as Array<string | undefined>;

  const numberLeft = strReverse(readWhileNumber(map[lineNo].slice(undefined, charNo).reverse().join("")));
  const numberRight = readWhileNumber(map[lineNo].slice(charNo + 1).join(""));

  numbers.push(numberLeft, numberRight);

  if (lineNo > 0) {
    const numberUpLeft = lineNo > 0 ? strReverse(readWhileNumber(map[lineNo - 1].slice(undefined, charNo).reverse().join(""))) : undefined;
    const numberUpRight = lineNo > 0 ? readWhileNumber(map[lineNo - 1].slice(charNo + 1).join("")) : undefined;

    if (asNumber(map[lineNo - 1][charNo]) !== undefined) {
      numbers.push(`${numberUpLeft ?? ""}${map[lineNo - 1][charNo]}${numberUpRight ?? ""}`);
    } else {
      numbers.push(numberUpLeft, numberUpRight);
    }
  }

  if (lineNo < map.length - 1) {
    const numberDownLeft = lineNo <= map.length ? strReverse(readWhileNumber(map[lineNo + 1].slice(undefined, charNo).reverse().join(""))) : undefined;
    const numberDownRight = lineNo <= map.length ? readWhileNumber(map[lineNo + 1].slice(charNo + 1).join("")) : undefined;

    if (asNumber(map[lineNo + 1][charNo]) !== undefined) {
      numbers.push(`${numberDownLeft ?? ""}${map[lineNo + 1][charNo]}${numberDownRight ?? ""}`);
    } else {
      numbers.push(numberDownLeft, numberDownRight);
    }
  } 

  return numbers.filter((n) => n !== undefined).map((n) => parseInt(n!));
}

export function gearRatio(map: Map, lineNo: number, charNo: number): number | undefined {
  const na = numbersAround(map, lineNo, charNo);

  if (na.length === 2) {
    return na[0] * na[1];
  } else {
    return;
  }
}

export function findGearRatios(map: Map): number[] {
  function findGearRatiosInLine(line: string[], lineNo: number): number[] {
    return line.reduce((prevGearRatios, currChar, charNo) => {
      if (currChar === '*') {
        const gr = gearRatio(map, lineNo, charNo);
        if (gr !== undefined) {
          prevGearRatios.push(gr);
        }
      }
      return prevGearRatios;
    }, [] as number[]);
  }

  return map.flatMap((line, lineNo) => findGearRatiosInLine(line, lineNo));
}

export function day3part2(input: string): number {
  const map = parseMap(input);

  const gearRatios = findGearRatios(map);

  return gearRatios.reduce((acc, curr) => acc + curr, 0);
}