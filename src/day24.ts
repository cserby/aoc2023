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