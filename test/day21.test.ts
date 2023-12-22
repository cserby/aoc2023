import { readFileSync } from "fs";
import { day21part1, day21part2, parseInput } from "../src/day21";

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

    test("Sample", () => {
      expect(day21part1(sample, 6)).toEqual(16);
    });

    test("Real", () => {
      expect(day21part1(readFileSync("inputs/day21.txt", { encoding: "utf-8" }))).toEqual(3820);
    });
  });

  describe("Part2", () => {
    test("Sample", () => {
      expect(day21part2(sample, 6)).toEqual(16);
      expect(day21part2(sample, 10)).toEqual(50);
      expect(day21part2(sample, 50)).toEqual(1594);
      expect(day21part2(sample, 100)).toEqual(6536);
    });

    test("Real", () => {
      expect(day21part2(readFileSync("inputs/day21.txt", { encoding: "utf-8" }))).toEqual(-1);
    });
  });
});