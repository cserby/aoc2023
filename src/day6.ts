export function root(a: number, b: number, c: number, which: -1 | 1): number | undefined {
  return -1 * (b + which * Math.sqrt(b * b - 4 * a * c)) / (2 * a);
}

export function roots(a: number, b: number, c: number): number[] {
  return (([1, -1] as const).map((w) => root(a, b, c, w)).filter((r) => r !== undefined) as number[]);
}

export interface Race {
  time: number;
  distance: number;
}

export function waysToWinARace(race: Race): number {
  const [root1, root2] = roots(-1, race.time, -1 * race.distance);
  if (root1 === undefined || root2 === undefined) {
    return 0;
  } else {
    return Math.ceil(root1) - Math.floor(root2) - 1;
  }
}

export function day6part1(races: Race[]): number {
  return races.map(waysToWinARace).reduce((acc, curr) => acc * curr, 1);
}