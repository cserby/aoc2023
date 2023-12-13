import { readFileSync } from "fs";
import { parseInput, transpose, findHorizontalMirror, day13part1, day13part2 } from "../src/day13";

const sample = `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`;

describe("Day13", () => {
  describe("Part1", () => {
    test("Transpose", () => {
      expect(transpose({
        lines: [
          ["1", "2"],
          ["3", "4"],
        ]
      })).toEqual({
        lines: [
          ["1", "3"],
          ["2", "4"],
        ]
      })
    });

    test("Horizontal", () => {
      expect(findHorizontalMirror(parseInput(sample)[1])).toEqual(4);
    });

    test("Vertical", () => {
      expect(findHorizontalMirror(transpose(parseInput(sample)[0]))).toEqual(5);
    });

    test("Sample", () => {
      expect(day13part1(sample)).toEqual(405);
    });

    test("Real", () => {
      expect(day13part1(readFileSync("inputs/day13.txt", { encoding: "utf-8" }))).toEqual(33122);
    });
  });

  describe("Part2", () => {
    test("Vertical", () => {
      expect(findHorizontalMirror(parseInput(sample)[0], true)).toEqual(3);
    });

    test("Sample", () => {
      expect(day13part2(sample)).toEqual(400);
    });

    test("Real", () => {
      expect(day13part2(readFileSync("inputs/day13.txt", { encoding: "utf-8" }))).toEqual(39583);
    });
  });
});