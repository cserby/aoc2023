import { readFileSync } from "fs";
import { cycle, day14part1, day14part2, parseInput, rotateLeft, rotateRight, tiltLeft, transpose } from "../src/day14";
import { error } from "console";

const sample = `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`;

describe("Day14", () => {
  describe("Part1", () => {
    test("Sample", () => { 
      expect(day14part1(sample)).toEqual(136);
    });

    test("Real", () => {
      expect(day14part1(readFileSync("inputs/day14.txt", { encoding: "utf-8" }))).toEqual(108759);
    });
  });

  describe("Part2", () => {
    /*
    test("Tilt left", () => {
      expect(tiltLeft([[...".#.O.O..#.O"]])).toEqual([[
        ...".#OO....#O."
      ]]);
    });

    test("Sample cycles", () => {
      expect(
        rotateRight(cycle(rotateLeft(parseInput(sample))))).toEqual(
          `.....#....
....#...O#
...OO##...
.OO#......
.....OOO#.
.O#...O#.#
....O#....
......OOOO
#...O###..
#..OO#....`.split("\n").map((l) => [...l])
        );
      
      expect(
        rotateRight(cycle(cycle(rotateLeft(parseInput(sample)))))).toEqual(
          `.....#....
....#...O#
.....##...
..O#......
.....OOO#.
.O#...O#.#
....O#...O
.......OOO
#..OO###..
#.OOO#...O`.split("\n").map((l) => [...l])
        );

      expect(
        rotateRight(cycle(cycle(cycle(rotateLeft(parseInput(sample))))))).toEqual(
          `.....#....
....#...O#
.....##...
..O#......
.....OOO#.
.O#...O#.#
....O#...O
.......OOO
#...O###.O
#.OOO#...O`.split("\n").map((l) => [...l])
        );
    });
    */

    test("Sample calc", () => {
      expect(day14part2(sample)).toEqual(64);
    });
  });
});