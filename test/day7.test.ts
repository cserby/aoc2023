import { compareHands, day7part1, day7part2, fourOfAKind, fullHouse, parseHand, parseInput, threeOfAKind, twoPairs } from "../src/day7";
import { readFileSync } from "fs";

const sample = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

const sampleLines = sample.split("\n");

describe("Day7", () => {
  describe("Part1", () => {
    test("Parsing", () => {
      expect(parseHand(sampleLines[0])).toEqual({
        cards: [..."32T3K"],
        bid: 765,
        cardCounts: {
          "3": 2,
          "2": 1,
          "T": 1,
          "K": 1,
        }
      });
    });

    test("Compare 1", () => {
      expect([parseHand(sampleLines[0]), parseHand(sampleLines[1])].sort(compareHands))
        .toEqual([
          expect.objectContaining({ cards: [..."32T3K"]}),
          expect.objectContaining({ cards: [..."T55J5"]}),
        ]);
    });

    test("Compare 2", () => {
      expect([parseHand(sampleLines[2]), parseHand(sampleLines[3])].sort(compareHands))
        .toEqual([
          expect.objectContaining({ cards: [..."KTJJT"]}),
          expect.objectContaining({ cards: [..."KK677"]}),
        ]);
    });

    test("Compare 3", () => {
      expect([parseHand(sampleLines[1]), parseHand(sampleLines[4])].sort(compareHands))
        .toEqual([
          expect.objectContaining({ cards: [..."T55J5"]}),
          expect.objectContaining({ cards: [..."QQQJA"]}),
        ]);
    });

    test("Sorting", () => {
      expect(parseInput(sample).sort(compareHands)).toEqual([
        expect.objectContaining({ cards: [..."32T3K"]}),
        expect.objectContaining({ cards: [..."KTJJT"]}),
        expect.objectContaining({ cards: [..."KK677"]}),
        expect.objectContaining({ cards: [..."T55J5"]}),
        expect.objectContaining({ cards: [..."QQQJA"]}),
      ])
    });

    test("Sample", () => {
      expect(day7part1(sample)).toEqual(6440);
    });

    test("Real", () => {
      expect(day7part1(readFileSync("inputs/day7.txt", { encoding: "utf-8" }))).toEqual(250232501);
    });
  });

  describe("Part2", () => {
    test("Two pairs", () => {
      expect(twoPairs(parseHand("AAKK2"), true)).toBe(true);
      expect(twoPairs(parseHand("AAKJ2"), true)).toBe(true);
      expect(twoPairs(parseHand("AJKJ2"), true)).toBe(true);
      expect(twoPairs(parseHand("AJKT2"), true)).toBe(false);
    });

    test("Full house", () => {
      expect(fullHouse(parseHand("AAKKK"), true)).toBe(true);
      expect(fullHouse(parseHand("AAKKJ"), true)).toBe(true);
      expect(fullHouse(parseHand("AJKKJ"), true)).toBe(true);
      expect(fullHouse(parseHand("ATKKJ"), true)).toBe(false);
    });

    test("Four of a kind", () => {
      expect(fourOfAKind(parseHand("QJJQ2"), true)).toBe(true);
    });

    test("Three of a kind", () => {
      expect(threeOfAKind(parseHand("33354"), true)).toBe(true);
    });

    test("Compare", () => {
      expect([parseHand("QJJQ2"), parseHand("QQQQ2")].sort(compareHands))
        .toEqual([
          expect.objectContaining({ cards: [..."QJJQ2"]}),
          expect.objectContaining({ cards: [..."QQQQ2"]}),
        ]);
    });

    test("Sample", () => {
      expect(day7part2(sample)).toEqual(5905);
    });

    test("Real", () => {
      expect(day7part2(readFileSync("inputs/day7.txt", { encoding: "utf-8" }))).toEqual(249138943);
    });
  });
});
