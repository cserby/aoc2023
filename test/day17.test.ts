import { readFileSync } from "fs";
import { day17part1 } from "../src/day17";

const sample = `2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`;

const sampleReduced = `24134\n32154`

describe("Day17", () => {
  describe("Part1", () => {
    test("Sample reduced", () => {
      expect(day17part1(sampleReduced)).toEqual(11);
    });

    test("Sample", () => {
      expect(day17part1(sample)).toEqual(102);
    });

    // test("Real", () => {
    //   expect(day17part1(readFileSync("inputs/day17.txt", { encoding: "utf-8" }))).toEqual(-1);
    // });
  });
});
