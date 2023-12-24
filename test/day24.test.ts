import { readFileSync } from "fs";
import { collide2d, day24part1, day24part2, parseInput } from "../src/day24";

const sample = `19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3`;

const real = readFileSync("inputs/day24.txt", { encoding: "utf-8" });

describe("Day24", () => {
  describe("Part1", () => {
    test("Collide", () => {
      const hstns = parseInput(sample);

      expect(collide2d(hstns[0], hstns[1])![0]).toBeCloseTo(14.333);

      expect(collide2d(hstns[0], hstns[2])![1]).toBeCloseTo(16.667);

      expect(collide2d(hstns[0], hstns[4])).toBeUndefined();

      expect(collide2d(hstns[1], hstns[2])).toBeUndefined();

      expect(collide2d(hstns[1], hstns[3])![0]).toBeCloseTo(-6);
    });

    test("Sample", () => {
      expect(day24part1(sample, [7, 27])).toEqual(2);
    });

    test("Real", () => {
      expect(day24part1(real)).toEqual(31921);
    });
  });

  describe("Part2", () => {
    test("Sample", () => {
      expect(day24part2(sample)).toEqual(`var('my_px my_py my_pz my_vx my_vy my_vz t0 t1 t2 ans')
eq0 = my_px + t0 * my_vx == 19 + t0 * -2
eq1 = my_py + t0 * my_vy == 13 + t0 * 1
eq2 = my_pz + t0 * my_vz == 30 + t0 * -2
eq3 = my_px + t1 * my_vx == 18 + t1 * -1
eq4 = my_py + t1 * my_vy == 19 + t1 * -1
eq5 = my_pz + t1 * my_vz == 22 + t1 * -2
eq6 = my_px + t2 * my_vx == 20 + t2 * -2
eq7 = my_py + t2 * my_vy == 25 + t2 * -2
eq8 = my_pz + t2 * my_vz == 34 + t2 * -4
eq9 = ans == my_px + my_py + my_pz
print(solve([eq0,eq1,eq2,eq3,eq4,eq5,eq6,eq7,eq8,eq9],my_px,my_py,my_pz,my_vx,my_vy,my_vz,t0,t1,t2,ans))`);
    });

    test("Real", () => {
      expect(day24part2(real)).toEqual(`var('my_px my_py my_pz my_vx my_vy my_vz t0 t1 t2 ans')
eq0 = my_px + t0 * my_vx == 309254625334097 + t0 * -42
eq1 = my_py + t0 * my_vy == 251732589486275 + t0 * -22
eq2 = my_pz + t0 * my_vz == 442061964691135 + t0 * -45
eq3 = my_px + t1 * my_vx == 494902262649699 + t1 * -345
eq4 = my_py + t1 * my_vy == 448845738683125 + t1 * -319
eq5 = my_pz + t1 * my_vz == 408766676225787 + t1 * -201
eq6 = my_px + t2 * my_vx == 281199817421623 + t2 * 89
eq7 = my_py + t2 * my_vy == 235413393248399 + t2 * 152
eq8 = my_pz + t2 * my_vz == 236652333766125 + t2 * -70
eq9 = ans == my_px + my_py + my_pz
print(solve([eq0,eq1,eq2,eq3,eq4,eq5,eq6,eq7,eq8,eq9],my_px,my_py,my_pz,my_vx,my_vy,my_vz,t0,t1,t2,ans))`);
    });
  });
});
