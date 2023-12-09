import { day9part1, day9part2 } from "../src/day9";
import { readFileSync } from "fs";

const sample = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;

describe("Day9", () => {
  describe("Part1", () => {
    test("Sample0", () => {
      expect(day9part1(sample.split("\n")[0])).toEqual(18);
    });

    test("Sample", () => {
      expect(day9part1(sample)).toEqual(114);
    });

    test("Real", () => {
      expect(day9part1(readFileSync("inputs/day9.txt", { encoding: "utf-8" }))).toEqual(2098530125);
    });
  });

  describe("Part2", () => {
    test("Sample", () => {
      expect(day9part2(sample)).toEqual(2);
    });

    test("Real", () => {
      expect(day9part2(readFileSync("inputs/day9.txt", { encoding: "utf-8" }))).toEqual(1016);
    });
  });
});
