import { readFileSync } from "fs";
import { allPossibleSplits, day12part1, day12part2, parseInput, possibleSolutions, possibleSolutions2, runLengths, unfold } from "../src/day12";

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

  describe("Part2", () => {
    test("Unfold", () => {
      expect(unfold(parseInput(sample)[0])).toEqual({
        fields: [..."???.###????.###????.###????.###????.###"],
        runLengths: [1, 1, 3, 1, 1, 3, 1, 1, 3, 1, 1, 3, 1, 1, 3],
      });
    });

    test("Sample1", () => {
      expect(possibleSolutions2(parseInput("..?##. 3")[0])).toEqual(1);
      expect(possibleSolutions2(parseInput("###???? 3,1,1")[0])).toEqual(1);
      expect(possibleSolutions2(parseInput("??? 1,1")[0])).toEqual(1);
      expect(possibleSolutions2(parseInput("### 3")[0])).toEqual(1);

      expect(day12part2(sample.split("\n")[0])).toEqual(1);
    });

    test("Sample2", () => {
      expect(day12part2(sample.split("\n")[1])).toEqual(16384);
    });

    test("Sample3", () => {
      expect(day12part2(sample.split("\n")[2])).toEqual(1);
    });

    test("Can be solution", () => {
      expect(possibleSolutions2(parseInput("???#??? 1")[0])).toEqual(1);
    });

    test("Sample from real", () => {
      expect(day12part2("???#???.?#?????? 1,2,2,3,2")).toEqual(50000);
    });

    test("All possible splits", () => {
      expect([...allPossibleSplits([1, 2, 3], 1)]).toEqual([[[1, 2, 3]]]);
      expect([...allPossibleSplits([1, 2, 3], 2)]).toEqual([
        [[], [1, 2, 3]],
        [[1], [2, 3]],
        [[1, 2], [3]],
        [[1, 2, 3], []],
      ]);
      expect([...allPossibleSplits([1], 3)]).toEqual([
        [[], [], [1]],
        [[], [1], []],
        [[1], [], []],
      ]);
    });

    test("Real", () => {
      expect(day12part2(readFileSync("inputs/day12.txt", { encoding: "utf-8" }))).toEqual(8475948826693);
    });
  });
});
