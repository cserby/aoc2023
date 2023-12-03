import { day3part1, day3part2 } from "../src/day3";
import { readFileSync } from "fs";

const sample = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;

describe("Day3", () => { 
  describe("Part1", () => {
    test("Sample", () => {
      expect(day3part1(sample)).toEqual(4361);
    });

    test("Real", () => {
      expect(day3part1(readFileSync("inputs/day3.txt", { encoding: "utf-8" }))).toEqual(529618);
    });
  });

  describe("Part2", () => {
    test("Sample", () => {
      expect(day3part2(sample)).toEqual(467835);
    });

    test("Real", () => {
      expect(day3part2(readFileSync("inputs/day3.txt", { encoding: "utf-8" }))).toEqual(77509019);
    });
  })
});