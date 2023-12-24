import { error } from "console";

interface Hailstone {
  px: number;
  py: number;
  pz: number;
  vx: number;
  vy: number;
  vz: number;
}

export function parseInput(input: string): Hailstone[] {
  function parseHailstone(line: string): Hailstone {
    const [pos, vel] = line.split("@ ");
    const [px, py, pz] = pos.split(", ").map((s) => parseInt(s));
    const [vx, vy, vz] = vel.split(", ").map((s) => parseInt(s));

    return { px, py, pz, vx, vy, vz };
  }

  return input.split("\n").map(parseHailstone);
}

export function collide2d(a: Hailstone, b: Hailstone): [number, number] | undefined {
  // a's trajectory: r_a(t) = p_a + v_a*t
  // b's trajectory: r_b(t) = p_b + v_b*t
  // looking for a t_a > 0 and t_b > 0 when p_a + v_a*t_a = p_b + v_b*t_b -> p_a - p_b = v_b*t_b - v_a*t_a
  // p_a_x - p_b_x = v_b_x * t_b - v_a_x * t_a
  // p_a_y - p_b_y = v_b_y * t_b - v_a_y * t_a
  // From #2 t_a = (-(p_a_y - p_b_y) + v_b_y * t_b) / v_a_y
  // Back to #1 p_a_x - p_b_x = v_b_x * t_b - v_a_x * ((-(p_a_y - p_b_y) + v_b_y * t_b) / v_a_y)
  // p_a_x - p_b_x = v_b_x * t_b - ((-p_a_y*v_a_x + p_b_y*v_a_x + v_b_y * t_b * v_a_x) / v_a_y)
  // p_a_x * v_a_y - p_b_x * v_a_y = v_a_y * v_b_x * t_b + p_a_y * v_a_x - p_b_y * v_a_x - v_b_y * v_a_x * t_b
  // p_a_x * v_a_y - p_b_x * v_a_y = t_b * (v_a_y * v_b_x  - v_b_y * v_a_x) + p_a_y * v_a_x - p_b_y * v_a_x
  // (p_a_x * v_a_y - p_b_x * v_a_y - p_a_y * v_a_x + p_b_y * v_a_x) / (v_a_y * v_b_x  - v_b_y * v_a_x) = t_b

  const denom = a.vy * b.vx - b.vy * a.vx;

  if (denom === 0) return;

  const t_b = (a.px * a.vy - b.px * a.vy - a.py * a.vx + b.py * a.vx) / denom;
  const t_a = (-(a.py - b.py) + b.vy * t_b) / a.vy;

  if (t_b < 0 || t_a < 0) return;

  return [a.px + a.vx * t_a, a.py + a.vy * t_a];
}

export function day24part1(input: string, test: [number, number] = [200000000000000, 400000000000000]): number {
  const hlstns = parseInput(input);
  const [testLow, testHigh] = test;

  let count = 0;

  for (let i = 0; i < hlstns.length - 1; i++) {
    for (let j = i; j < hlstns.length; j++) {
      const collision = collide2d(hlstns[i], hlstns[j]);
      if (collision === undefined) continue;

      const [collisionX, collisionY] = collision;

      if (
        testLow <= collisionX &&
        testHigh >= collisionX &&
        testLow <= collisionY &&
        testHigh >= collisionY
      ) count++;
    }
  }

  return count;
}

export function day24part2(input: string): string {
  // My position + velocity -> 6 unknowns

  // My trajectory collides with hailstone 1 at t_1 -> 7 unknowns, 3 equations
  // my_p + t_1 * my_v = hs_p + t_1 * hs_v

  // My trajectory collides with hailstone 2 at t_2 -> 8 unknowns, 6 equations
  // my_p + t_2 * my_v = hs_p + t_2 * hs_v

  // My trajectory collides with hailstone 3 at t_3 -> 9 unknowns, 9 equations
  // my_p + t_3 * my_v = hs_p + t_3 * hs_v

  // -> solvable!

  const hlstns = parseInput(input);
  const sageScript = ["var('my_px my_py my_pz my_vx my_vy my_vz t0 t1 t2 ans')"];
  for (let i = 0; i < 3; i++) {
    sageScript.push(`eq${3*i + 0} = my_px + t${i} * my_vx == ${hlstns[i].px} + t${i} * ${hlstns[i].vx}`);
    sageScript.push(`eq${3*i + 1} = my_py + t${i} * my_vy == ${hlstns[i].py} + t${i} * ${hlstns[i].vy}`);
    sageScript.push(`eq${3*i + 2} = my_pz + t${i} * my_vz == ${hlstns[i].pz} + t${i} * ${hlstns[i].vz}`);
  }

  sageScript.push("eq9 = ans == my_px + my_py + my_pz");
  sageScript.push("print(solve([eq0,eq1,eq2,eq3,eq4,eq5,eq6,eq7,eq8,eq9],my_px,my_py,my_pz,my_vx,my_vy,my_vz,t0,t1,t2,ans))")

  return sageScript.join("\n");

  // Plop the script into https://cocalc.com/features/sage
}