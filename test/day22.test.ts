import { readFileSync } from "fs";
import { day22part1, parseInput } from "../src/day22";

const sample = `1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9`;

const real = readFileSync("inputs/day22.txt", { encoding: "utf-8" });

describe("Day22", () => {
  describe("Part1", () => {
    test("Bricks in right z-dir", () => {
      expect(() => parseInput(real)).not.toThrow();
    });
    
    test("Sample", () => {
      expect(day22part1(sample)).toEqual(5);
    });

    test("Real", () => {
      expect(day22part1(real)).toEqual(405);
    });
  });
});
