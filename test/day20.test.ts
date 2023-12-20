import { readFileSync } from "fs";
import { day20part1, parseInput, pushButton } from "../src/day20";

const sample1 = `broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a`;

const sample2 = `broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output`;

describe("Day20", () => {
  describe("Part1", () => {
    test("Parsing", () => {
      expect(parseInput(sample1)).toEqual(
        expect.objectContaining({
          b: expect.objectContaining({
            inputs: ["broadcaster", "a"],
            outputs: ["c"],
            state: false,
          }),
          broadcaster: expect.objectContaining({
            inputs: [],
            outputs: ["a", "b", "c"],
          }),
          inv: expect.objectContaining({
            inputs: ["c"],
            outputs: ["a"],
            prevPulses: {},
          }),
        }),
      );
    });

    test("Button", () => {
      expect(pushButton(parseInput(sample1))[1]).toEqual({
        "L": 8,
        "H": 4,
      });
    });

    test("Button2", () => {
      // expect(pushButton(parseInput(sample2), 4)[1]).toEqual({
      //   "L": 11,
      //   "H": 17,
      // });

      expect(pushButton(parseInput(sample2), 1000)[1]).toEqual({
        "L": 4250,
        "H": 2750,
      });
    });

    test("Sample1", () => {
      expect(day20part1(sample1)).toEqual(32000000);
    });

    test("Sample2", () => {
      expect(day20part1(sample2)).toEqual(11687500);
    });

    test("Real", () => {
      expect(day20part1(readFileSync("inputs/day20.txt", { encoding: "utf-8" }))).toEqual(670984704);
    });
  });
});
