import { day1part1 } from "../src/day1";
import { readFileSync } from "fs";

const sample = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`;

describe("Day1", () => {
  describe("Part1", () => {
    test("Sample", () => {
      expect(day1part1(sample)).toEqual(142);
    });

    test("Real", () => {
      expect(day1part1(readFileSync("inputs/day1.txt", { encoding: "utf-8" }))).toEqual(54601);
    });
  });
});
