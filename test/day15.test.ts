import { readFileSync } from "fs";
import { HASH, day15part1 } from "../src/day15";

const sample = `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`;

describe("Day15", () => {
  describe("Part1", () => {
    test("HASH", () => {
      expect(HASH("rn=1")).toEqual(30);
    });

    test("Sample", () => {
      expect(day15part1(sample)).toEqual(1320);
    });
    
    test("Real", () => {
      expect(day15part1(readFileSync("inputs/day15.txt", { encoding: "utf-8" }))).toEqual(497373);
    });
  });
});
