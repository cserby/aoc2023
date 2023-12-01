import { day1part1, day1part2, findFirstNumber, findLastNumber } from "../src/day1";
import { readFileSync } from "fs";

describe("Day1", () => {
  describe("Part1", () => {
    test("Sample", () => {
      const sample = `1abc2
        pqr3stu8vwx
        a1b2c3d4e5f
        treb7uchet`;

      expect(day1part1(sample)).toEqual(142);
    });

    test("Real", () => {
      expect(day1part1(readFileSync("inputs/day1.txt", { encoding: "utf-8" }))).toEqual(54601);
    });
  });

  describe("Part2", () => {
    const sample = `two1nine
    eightwothree
    abcone2threexyz
    xtwone3four
    4nineeightseven2
    zoneight234
    7pqrstsixteen`;

    test("two1nine", () => {
      expect(findFirstNumber("two1nine")).toEqual(2);
      expect(findLastNumber("two1nine")).toEqual(9);
    })

    test("Sample", () => {
      expect(day1part2(sample)).toEqual(281);
    });

    test("Real", () => {
      expect(day1part2(readFileSync("inputs/day1.txt", { encoding: "utf-8" }))).toEqual(54078);
    });
  });
});
