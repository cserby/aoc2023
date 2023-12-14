import { readFileSync } from "fs";
import { cycle, day14part1, day14part2, parseInput, rotateLeft, rotateRight, tiltLeft, toString } from "../src/day14";

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
    test("Tilt left", () => {
      expect(tiltLeft(".#.O.O..#.O")).toEqual([[
        ...".#OO....#O."
      ]]);
    });

    test("Sample cycles", () => {
      expect(
        rotateRight(cycle(toString(rotateLeft(parseInput(sample)))))).toEqual(
          `.....#....
....#...O#
...OO##...
.OO#......
.....OOO#.
.O#...O#.#
....O#....
......OOOO
#...O###..
#..OO#....`
        );
      
      expect(
        rotateRight(cycle(cycle(toString(rotateLeft(parseInput(sample))))))).toEqual(
          `.....#....
....#...O#
.....##...
..O#......
.....OOO#.
.O#...O#.#
....O#...O
.......OOO
#..OO###..
#.OOO#...O`
        );

      expect(
        rotateRight(cycle(cycle(cycle(toString(rotateLeft(parseInput(sample)))))))).toEqual(
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

    test("Sample calc", () => {
      expect(day14part2(sample)).toEqual(64);
    });

    test("Real", () => {
      expect(day14part2(readFileSync("inputs/day14.txt", { encoding: "utf-8" }))).toEqual(89089);
    });
  });
});