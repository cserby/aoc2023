import { readFileSync } from "fs";
import { day10part1, day10part2, findDistances, parseInput } from "../src/day10";

const sample1 = `-L|F7
7S-7|
L|7||
-L-J|
L|-JF`;

const sample2 = `7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ`;

describe("Day10", () => {
  describe("Part1", () => {
    test("Parsing", () => {
      expect(parseInput(sample1)).toEqual(expect.objectContaining({
        start: { line: 1, char: 1 },
      }));
      expect(parseInput(sample2)).toEqual(expect.objectContaining({
        start: { line: 2, char: 0 },
      }));
    });

    test("FindDistances", () => {
      expect(findDistances(parseInput(sample1))[0]).toEqual([
        [Infinity, Infinity, Infinity, Infinity, Infinity],
        [Infinity, 0,        1,        2,        Infinity],
        [Infinity, 1,        Infinity, 3,        Infinity],
        [Infinity, 2,        3,        4,        Infinity],
        [Infinity, Infinity, Infinity, Infinity, Infinity],
      ]);

      expect(findDistances(parseInput(sample2))[0]).toEqual(
        [
          [Infinity, Infinity, 4,        5,        Infinity],
          [Infinity, 2,        3,        6,        Infinity],
          [0,        1,        Infinity, 7,        8       ],
          [1,        4,        5,        6,        7       ],
          [2,        3,        Infinity, Infinity, Infinity],
        ],
      );
    });

    test("Sample1", () => {
      expect(day10part1(sample1)).toEqual(4);
    });
  
    test("Sample2", () => {
      expect(day10part1(sample2)).toEqual(8);
    });
  
    test("Real", () => {
      expect(day10part1(readFileSync("inputs/day10.txt", { encoding: "utf-8" }))).toEqual(6979);
    });
  });

  describe("Part2", () => {
    test("Real", () => {
      expect(day10part2(readFileSync("inputs/day10.txt", { encoding: "utf-8" }))).toEqual(443);
    });
  });
});
