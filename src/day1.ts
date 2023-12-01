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