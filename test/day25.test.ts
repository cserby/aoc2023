import { readFileSync } from "fs";
import { day25part1 } from "../src/day25";

const sample = `jqt: rhn xhk nvd
rsh: frs pzl lsr
xhk: hfx
cmg: qnr nvd lhk bvb
rhn: xhk bvb hfx
bvb: xhk hfx
pzl: lsr hfx nvd
qnr: nvd
ntq: jqt hfx bvb xhk
nvd: lhk
lsr: lhk
rzs: qnr cmg lsr rsh
frs: qnr lhk lsr`;

const real = readFileSync("inputs/day25.txt", { encoding: "utf-8" });

describe("Day25", () => {
  describe("Part1", () => {
    test("Sample", () => {
      expect(day25part1(sample, [
        ["hfx", "pzl"],
        ["bvb", "cmg"],
        ["nvd", "jqt"],
      ])).toEqual(54);
    });

    test("Real", () => {
      expect(day25part1(real)).toEqual(571753);
    });
  });
});
