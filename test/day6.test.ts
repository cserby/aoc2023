import { waysToWinARace, Race, day6part1 } from "../src/day6";
import realInput from "../inputs/day6.json";

const sample: Race[] = [
  {
    time: 7,
    distance: 9,
  },
  {
    time: 15,
    distance: 40,
  },
  {
    time: 30,
    distance: 200,
  }
];

describe("Day6", () => {
  describe("Part1", () => {
    test("Sample1", () => {
      expect(waysToWinARace(sample[0])).toEqual(4);
    });

    test("Sample2", () => {
      expect(waysToWinARace(sample[1])).toEqual(8);
    });

    test("Sample3", () => {
      expect(waysToWinARace(sample[2])).toEqual(9);
    });

    test("Sample", () => {
      expect(day6part1(sample)).toEqual(288);
    })

    test("Real", () => {
      expect(day6part1(realInput)).toEqual(316800);
    })
  });
});