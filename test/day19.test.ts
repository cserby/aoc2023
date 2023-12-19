import { readFileSync } from "fs";
import { Domain, Part, acceptedDomains, day19part1, day19part2 } from "../src/day19";

const sample = `px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`;

describe("Day19", () => {
  describe("Part1", () => {
    test("Sample", () => {
      expect(day19part1(sample)).toEqual(19114);
    });

    test("Real", () => {
      expect(day19part1(readFileSync("inputs/day19.txt", { encoding: "utf-8" }))).toEqual(456651);
    });
  });

  describe("Part2", () => {
    test("Apply2", () => {
      const acceptedInPart1 = [{ "x": 787, "m": 2655, "a": 1222, "s": 2876 }, { "x": 2036, "m": 264, "a": 79, "s": 2244 }, { "x": 2127, "m": 1623, "a": 2188, "s": 1013 }];
      const acceptedDomains2 = acceptedDomains(sample);

      const inDomain = (p: Part, d: Domain) =>
        p.x < d.x["<"] &&
        p.x > d.x[">"] &&
        p.m < d.m["<"] &&
        p.m > d.m[">"] &&
        p.a < d.a["<"] &&
        p.a > d.a[">"] &&
        p.s < d.s["<"] &&
        p.s > d.s[">"];
      
      expect(acceptedDomains2.filter((d) => inDomain(acceptedInPart1[0], d))).toBeDefined();
      expect(acceptedDomains2.filter((d) => inDomain(acceptedInPart1[1], d))).toBeDefined();
      expect(acceptedDomains2.filter((d) => inDomain(acceptedInPart1[2], d))).toBeDefined();
    });

    test("Sample", () => {
      expect(day19part2(sample)).toEqual(167409079868000);
    });

    test("Real", () => {
      expect(day19part2(readFileSync("inputs/day19.txt", { encoding: "utf-8" }))).toEqual(131899818301477);
    });
  });
});
