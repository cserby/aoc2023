import { readFileSync } from "fs";
import { day16part1 } from "../src/day16";

const sample = `.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`;

describe("Day16", () => {
  describe("Part1", () => {
    test("Sample", () => {
      expect(day16part1(sample)).toEqual(46);
    });

    test("Real", () => {
      expect(day16part1(readFileSync("inputs/day16.txt", { encoding: "utf-8" }))).toEqual(7434);
    });
  });
});
