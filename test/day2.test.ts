import { readFileSync } from "fs";
import { gameParser, gamePossible, type Draw, part1 } from "../src/day2";

const samplesStr = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`

  
const samples = samplesStr.split("\n");

const colorLimit: Draw = {
  red: 12,
  green: 13,
  blue: 14,
};

describe("Day2", () => {
  describe("Part1", () => {
    describe("Parser", () => {
      test("Sample1", () => {
        expect(gameParser(samples[0])).toEqual(
          expect.objectContaining({
            id: 1,
            draws: [
              {
                red: 4,
                green: 0,
                blue: 3,
              },
              {
                red: 1,
                green: 2,
                blue: 6,
              },
              {
                red: 0,
                green: 2,
                blue: 0,
              },
            ]
          })
        )
      });
    });

    describe("Game possible", () => {
      test("Sample2", () => {
        expect(gamePossible(gameParser(samples[1]), colorLimit)).toEqual(2);
      });

      test("Sample3", () => {
        expect(gamePossible(gameParser(samples[2]), colorLimit)).toBeUndefined();
      });
    });

    describe("Part1", () => {
      test("Sample", () => {
        expect(part1(samplesStr, colorLimit)).toEqual(8);
      });

      test("Real", () => {
        expect(part1(readFileSync("inputs/day2.txt", { encoding: "utf-8" }), colorLimit)).toEqual(2076);
      });
    });
  });
});
