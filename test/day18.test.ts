import { readFileSync } from "fs";
import { calculateVolume, day18part1, dig, parseInput, plot } from "../src/day18";

const sample = `R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`;

describe("Day18", () => {
  describe("Part1", () => {
    test("Dig + Plot", () => {
      expect(plot(dig(parseInput(sample)))).toEqual(`#######
#.....#
###...#
..#...#
..#...#
###.###
#...#..
##..###
.#....#
.######
`);
    });

    test("Sample", () => {
      expect(calculateVolume(dig(parseInput(sample)))).toEqual(62);
    });

    test("Real", () => {
      expect(day18part1(readFileSync("inputs/day18.txt", { encoding: "utf-8" }))).toEqual(39039);
    });
  });
});
