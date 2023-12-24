import { readFileSync } from "fs";
import { collide2d, day24part1, parseInput } from "../src/day24";

const sample = `19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3`;

const real = readFileSync("inputs/day24.txt", { encoding: "utf-8" });

describe("Day24", () => {
  describe("Part1", () => {
    test("Collide", () => {
      const hstns = parseInput(sample);

      expect(collide2d(hstns[0], hstns[1])![0]).toBeCloseTo(14.333);

      expect(collide2d(hstns[0], hstns[2])![1]).toBeCloseTo(16.667);

      expect(collide2d(hstns[0], hstns[4])).toBeUndefined();

      expect(collide2d(hstns[1], hstns[2])).toBeUndefined();

      expect(collide2d(hstns[1], hstns[3])![0]).toBeCloseTo(-6);
    });

    test("Sample", () => {
      expect(day24part1(sample, [7, 27])).toEqual(2);
    });

    test("Real", () => {
      expect(day24part1(real)).toEqual(31921);
    });
  });
});
