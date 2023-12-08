import { day8part1, day8part2, instructions, parseInput } from "../src/day8";
import { readFileSync } from "fs";

describe("Day8", () => {
  describe("Part1", () => {
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

  describe("Part2", () => {
    const sample = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`;

    test("Sample", () => {
      expect(day8part2(sample)).toEqual(6);
    });

    test.skip("Real @only", () => { // Never completes
      expect(day8part2(readFileSync("inputs/day8.txt", { encoding: "utf-8" }))).toEqual(6);
    }, Infinity);

    test("Calc cycles", () => {
      // Output step number when each ghost ends up at a node that ends with Z
      // "Luckily" each of my ghosts are trapped in a cycle right from the start, and
      // don't alternate between ending nodes
      // Thus result is https://www.wolframalpha.com/input?i=least+common+multiple+20221%2C+13019%2C+19667%2C+14681%2C+18559%2C+16897
    });
  });
});