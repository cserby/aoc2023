import { readFileSync } from "fs";
import { day11part1, day11part2, distance, expand, parseInput, sumDistances } from "../src/day11";

const sample = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`;

describe("Day11", () => {
  describe("Part1", () => {
    test("Parsing", () => {
      expect(parseInput(sample)).toEqual(expect.objectContaining({
        stars: expect.arrayContaining([
          { line: 0, char: 3 },
          { line: 2, char: 0 },
          { line: 6, char: 9 },
        ]),
        emptyLines: [3, 7],
        emptyChars: [2, 5, 8],
      }))
    });

    test("Expand", () => {
      expect(expand(parseInput(sample))).toEqual(parseInput(`....#........
.........#...
#............
.............
.............
........#....
.#...........
............#
.............
.............
.........#...
#....#.......`));
    });

    test("Distance", () => {
      expect(distance({ line: 6, char: 1 }, { line: 11, char: 5 })).toEqual(9);

      expect(distance({ line: 6, char: 1 }, { line: 11, char: 1 })).toEqual(5);
    });

    test("Sample", () => {
      expect(day11part1(sample)).toEqual(374);
    });

    test("Real", () => {
      expect(day11part1(readFileSync("inputs/day11.txt", { encoding: "utf-8" }))).toEqual(10494813);
    });
  });

  describe("Part2", () => {
    test("Sample10", () => {
      expect(sumDistances(sample, 10)).toEqual(1030);
      expect(sumDistances(sample, 100)).toEqual(8410);
    });

    test("Real", () => {
      expect(day11part2(readFileSync("inputs/day11.txt", { encoding: "utf-8" }))).toEqual(840988812853);
    });
  });
});
