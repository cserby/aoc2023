import { readFileSync } from "fs";
import { day12part1, parseInput, possibleSolutions, runLengths } from "../src/day12";

const sample = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;

describe("Day12", () => {
  describe("Part1", () => {
    test("Parsing", () => {
      expect(parseInput(sample)[2]).toEqual(expect.objectContaining({
        runLengths: [1, 3, 1, 6],
      }));
    });

    test("Run lengths", () => {
      const arr = parseInput(sample)[2];
      expect(runLengths(arr.fields)).toEqual([1, 1, 1, 1, 1, 1, 1]);
    });

    test("Possible solutions1", () => {
      const arr = parseInput(sample)[0];
      expect(possibleSolutions(arr)).toEqual([
        "#.#.###",
      ])
    });

    test("Possible solutions2", () => {
      const arr = parseInput(sample)[1];
      expect(possibleSolutions(arr)).toHaveLength(4);
    });

    test("Sample", () => {
      expect(day12part1(sample)).toEqual(21);
    });

    test("Real", () => {
      expect(day12part1(readFileSync("inputs/day12.txt", { encoding: "utf-8" }))).toEqual(6852);
    });
  });
});
