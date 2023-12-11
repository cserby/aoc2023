export interface Coords {
  line: number;
  char: number;
}

export interface Galaxy {
  stars: Coords[];
  numLines: number;
  numChars: number;
  emptyLines: number[];
  emptyChars: number[];
}

export function parseInput(input: string): Galaxy {
  const stars: Coords[] = [];
  const emptyLines: number[] = [];

  const lines = input.split("\n");
  const numLines = lines.length;
  const numChars = lines[0].length;

  lines.forEach((line, lineNo) => {
    const starsBefore = stars.length;

    [...line].forEach((char, charNo) => {
      if (char === "#") {
        stars.push({ line: lineNo, char: charNo });
      }
    });

    if (stars.length === starsBefore) {
      emptyLines.push(lineNo);
    }
  });

  const emptyChars: number[] = findEmpty(
    stars,
    (s) => s.char,
    numChars
  );

  return { stars, emptyLines, emptyChars, numLines, numChars };
}

export function findEmpty(stars: Coords[], fieldSelector: (s: Coords) => number, max: number): number[] {
  return stars.reduce(
    (prevEmptyChars, currStar) => {
      return prevEmptyChars.filter((e) => e !== fieldSelector(currStar));
    },
    Array(max).fill(undefined).map((_, index) => index)
  );
}

export function expand(galaxy: Galaxy, times: number = 2): Galaxy {
  const stars = galaxy.stars.reduce((prevStars, currStar) => {
    prevStars.push({
      line: currStar.line + (galaxy.emptyLines.filter((el) => el < currStar.line).length) * (times - 1),
      char: currStar.char + (galaxy.emptyChars.filter((ec) => ec < currStar.char).length) * (times - 1),
    });
    return prevStars;
  }, [] as Coords[]);
  const numLines = galaxy.numLines + galaxy.emptyLines.length * (times - 1);
  const numChars = galaxy.numChars + galaxy.emptyChars.length * (times - 1);

  return {
    stars,
    numLines,
    numChars,
    emptyChars: times === 2 ? findEmpty(stars, (s) => s.char, numChars) : [],
    emptyLines: times === 2 ? findEmpty(stars, (s) => s.line, numLines) : [],
  };
}

export function distance(a: Coords, b: Coords): number {
  return Math.abs(b.line - a.line) + Math.abs(b.char - a.char);
}

export function* allPairs<T>(a: Array<T>): Generator<[T, T], void, unknown> {
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = i + 1; j < a.length; j++) {
      yield [a[i], a[j]];
    }
  }
}

export function sumDistances(input: string, expandTimes: number = 2): number {
  return [...allPairs(expand(parseInput(input), expandTimes).stars)]
    .map(([a, b]) => distance(a, b))
    .reduce((a, b) => a + b, 0);
}

export function day11part1(input: string): number {
  return sumDistances(input);
}

export function day11part2(input: string): number {
  return sumDistances(input, 1_000_000);
}
