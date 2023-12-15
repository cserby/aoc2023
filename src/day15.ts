export function HASH(str: string): number {
  return [...str].reduce((prevHsh, currChar) => {
    return ((prevHsh + currChar.charCodeAt(0)) * 17) % 256
  }, 0);
}

export function day15part1(input: string): number {
  return input.split(",").map(HASH).reduce((a, b) => a + b);
}