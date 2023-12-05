import { day5part1, day5part2, day5part2naive, seedRangeToLocations, intersectAndMapRange, parseInput } from "../src/day5";
import { readFileSync } from "fs";

const sample = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;

describe("Day5", () => {
  
  describe("Part1", () => {
    test("Parsing", () => {
      expect(parseInput(sample)).toEqual(expect.objectContaining({
        seeds: [79, 14, 55, 13],
        seedToSoil: expect.arrayContaining([
          {
            destinationStart: 52,
            sourceStart: 50,
            sourceEnd: 50 + 48 - 1,
          }
        ]),
        humidityToLocation: expect.arrayContaining([
          {
            destinationStart: 56,
            sourceStart: 93,
            sourceEnd: 93 + 4 - 1,
          }
        ]),
      }))
    });

    test("Sample", () => {
      expect(day5part1(sample)).toEqual(35);
    });

    test("Real", () => {
      expect(day5part1(readFileSync("inputs/day5.txt", { encoding: "utf-8" }))).toEqual(51580674);
    });
  });

  describe("Part2", () => {
    describe("Intersect ranges", () => {
      test("No intersection", () => {
        expect(intersectAndMapRange({ start: 4, end: 6 }, { destinationStart: 4, sourceStart: 8, sourceEnd: 199 })).toEqual([
          { start: 4, end: 6 },
          undefined,
          undefined,
        ]);
      });

      test("Input superset of maprange", () => {
        expect(intersectAndMapRange(
          { start: 0, end: 3 }, // 0, 1, 2, 3
          { destinationStart: 164, sourceStart: 2, sourceEnd: 2 }) // 2
        ).toEqual([
          { start: 0, end: 1 }, // 0, 1
          { start: 164, end: 164 }, // 2 -> 164
          { start: 3, end: 3 }, // 3
        ]);
      });

      test("Input subset of maprange", () => {
        expect(intersectAndMapRange(
          { start: 2, end: 3 },
          { destinationStart: -32, sourceStart: 0, sourceEnd: 16 })
        ).toEqual([
          undefined,
          { start: -30, end: -29 }, // 2, 3 -> -30
          undefined,
        ]);
      });

      test("Input starts with maprange", () => {
        expect(intersectAndMapRange(
          { start: 0, end: 2 },
          { destinationStart: 55, sourceStart: 0, sourceEnd: 16 })
        ).toEqual([
          undefined,
          { start: 55, end: 57 }, // 0, 1, 2 -> 55
          undefined,
        ]);
      });

      test("Input ends with maprange", () => {
        expect(intersectAndMapRange(
          { start: 2, end: 3 },
          { destinationStart: 5, sourceStart: 0, sourceEnd: 3 })
        ).toEqual([
          undefined,
          { start: 7, end: 8 }, // 2, 3 -> 7
          undefined,
        ]);
      });

      test("Input partially below maprange", () => {
        expect(intersectAndMapRange(
          { start: -2, end: 1 }, // -2, -1, 0, 1
          { destinationStart: 5, sourceStart: 0, sourceEnd: 3 }) // 0, 1, 2, 3
        ).toEqual([
          { start: -2, end: -1 }, // -2, -1
          { start: 5, end: 6 }, // 0, 1 -> 6
          undefined,
        ]);
      });

      test("Input partially above maprange", () => {
        expect(intersectAndMapRange(
          { start: 3, end: 6 }, // 3, 4, 5, 6
          { destinationStart: -5, sourceStart: 0, sourceEnd: 3 }) // 0, 1, 2, 3
        ).toEqual([
          undefined,
          { start: -2, end: -2 }, // 3 -> -2
          { start: 4, end: 6 }, // 4, 5, 6
        ]);
      });
    });


    test("Sample naive", () => {
      expect(day5part2naive(sample)).toEqual(46);
    });

    test("Sample calc", () => {
      expect(seedRangeToLocations({ start: 82, end: 82 }, parseInput(sample))[0].start).toEqual(46);
    });

    test("Sample", () => {
      expect(day5part2(sample)).toEqual(46);
    });

    test("Real", () => {
      expect(day5part2(readFileSync("inputs/day5.txt", { encoding: "utf-8" }))).toEqual(99751240);
    });
  });
});
