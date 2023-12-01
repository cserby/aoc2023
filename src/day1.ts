export function charcodes(line: string): number[] {
  return [...line].map((c) => c.charCodeAt(0) - "0".charCodeAt(0));
}

function firstNumber(codes: number[]): number {
  return codes.find((c) => c >= 0 && c <= 9)!;
}

export function day1part1(input: string): number {
  const inputLines = input.split("\n");
  const lineCodes = inputLines.map(charcodes);
  const numbers = lineCodes.map((lc) => parseInt(`${firstNumber(lc)}${firstNumber(lc.reverse())}`));
  return numbers.reduce((acc, curr) => acc + curr, 0);
}

export function findFirst(line: string, substringsOfInterest: string[]): string {
  return substringsOfInterest
    .map((soi) => [soi, line.indexOf(soi)])
    .filter(([_literal, index]) => index != -1)
    .sort(([_lit1, index1], [_lit2, index2]) => index1 < index2 ? -1 : 1)[0]![0] as string;
}

export function strReverse(str: string): string {
  return [...str].reverse().join("");
}

export const valueMap = {
  "0": 0,
  "zero": 0,
  "1": 1,
  "one": 1,
  "2": 2,
  "two": 2,
  "3": 3,
  "three": 3,
  "4": 4,
  "four": 4,
  "5": 5,
  "five": 5,
  "6": 6,
  "six": 6,
  "7": 7,
  "seven": 7,
  "8": 8,
  "eight": 8,
  "9": 9,
  "nine": 9,
};

export function findFirstNumber(line: string): number {
  return (valueMap[findFirst(line, Object.keys(valueMap)) as keyof typeof valueMap]);
}

export function findLastNumber(line: string): number {
  return valueMap[strReverse(findFirst(strReverse(line), Object.keys(valueMap).map(strReverse))) as keyof typeof valueMap];
}

export function day1part2(input: string): number {
  const inputLines = input.split("\n");
  const numbers = inputLines.map((line) => {
    const firstNumber = findFirstNumber(line);
    const lastNumber = findLastNumber(line);
    return parseInt(`${firstNumber}${lastNumber}`);
  });
  return numbers.reduce((acc, curr) => acc + curr, 0);
}