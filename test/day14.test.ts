import { readFileSync } from "fs";
import { day14part1 } from "../src/day14";

const sample = `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`;

describe("Day14", () => {
  describe("Part1", () => {
    test("Sample", () => { 
      expect(day14part1(sample)).toEqual(136);
    });

    test("Real", () => {
      expect(day14part1(readFileSync("inputs/day14.txt", { encoding: "utf-8" }))).toEqual(108759);
    });
  });
});