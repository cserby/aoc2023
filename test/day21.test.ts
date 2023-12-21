import { readFileSync } from "fs";
import { canGoTo, day21part1, parseInput } from "../src/day21";

const sample = `...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`;

describe("Day21", () => {
  describe("Part1", () => {
    test("Parsing", () => {
      expect(parseInput(sample)).toEqual(expect.objectContaining({
        start: { line: 5, char: 5 },
      }));
    });

    test("CanGoTo", () => {
      const puzzle = parseInput(sample);
      expect(canGoTo(puzzle.start, puzzle, 1)).toEqual(
        expect.arrayContaining([
          JSON.stringify({ line: 5, char: 4 }),
          JSON.stringify({ line: 4, char: 5 }),
        ])
      );
    });

    test("Sample", () => {
      expect(day21part1(sample, 6)).toEqual(16);
    });

    test("Real", () => {
      expect(day21part1(readFileSync("inputs/day21.txt", { encoding: "utf-8" }))).toEqual(3820);
    });
  });
});