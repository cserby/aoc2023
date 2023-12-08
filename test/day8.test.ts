import { day8part1, instructions, parseInput } from "../src/day8";
import { readFileSync } from "fs";

const sample1 = `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`;

const sample2 = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`;

describe("Day8", () => {
  describe("Part1", () => {
    test("Parsing", () => {
      expect(parseInput(sample1)).toEqual({
        instructions: [..."RL"],
        map: expect.objectContaining({
          "CCC": expect.objectContaining({
            left: "ZZZ",
            right: "GGG",
          }),
        }),
      });
    });

    test("Instructions", () => {
      const instr = instructions(parseInput(sample2));
      expect(instr.next().value).toEqual("L");
      expect(instr.next().value).toEqual("L");
      expect(instr.next().value).toEqual("R");
      expect(instr.next().value).toEqual("L");
      expect(instr.next().value).toEqual("L");
      expect(instr.next().value).toEqual("R");
    });

    test("Sample1", () => {
      expect(day8part1(sample1)).toEqual(2);
    });

    test("Sample2", () => {
      expect(day8part1(sample2)).toEqual(6);
    });

    test("Real", () => {
      expect(day8part1(readFileSync("inputs/day8.txt", { encoding: "utf-8" }))).toEqual(20221);
    });
  });
});