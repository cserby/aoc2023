interface Point {
  x: number;
  y: number;
  z: number;
}

interface Brick {
  // Single straight line of cubes
  point1: Point;
  point2: Point;
  supportedBy: number[];
}

export function parseInput(input: string): Brick[] {
  function parsePoint(pt: string): Point {
    const [x, y, z] = pt.split(",").map((s) => parseInt(s));
    return { x, y, z };
  }
  
  function parseBrick(line: string): Brick {
    const [point1, point2] = line.split("~").map(parsePoint);
    if (point1.z > point2.z) throw new Error("Need to flip");
    return { point1, point2, supportedBy: [] };
  }

  return input.split("\n").map(parseBrick);
}

function orderByZ(bricks: Brick[]): Brick[] {
  return bricks.sort((a, b) => a.point1.z - b.point1.z);
}

interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
}

function bounds(bricks: Brick[]): Bounds {
  const xs = [...bricks.map((b) => b.point1.x), ...bricks.map((b) => b.point2.x)];
  const ys = [...bricks.map((b) => b.point1.y), ...bricks.map((b) => b.point2.y)];
  const zs = [...bricks.map((b) => b.point1.z), ...bricks.map((b) => b.point2.z)];

  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
    minZ: Math.min(...zs),
    maxZ: Math.max(...zs),
  };
}

interface HorizontalProjPoint {
  x: number;
  y: number;
}

function horizontalProjection(brick: Brick): HorizontalProjPoint[] {
  const [minX, maxX] = [brick.point1.x, brick.point2.x].sort();
  const [minY, maxY] = [brick.point1.y, brick.point2.y].sort();

  const points = [];
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      points.push({ x, y });
    }
  }

  return points;
}

export function drop(bricks: Brick[]): Brick[] {
  const bnds = bounds(bricks);

  interface FloorTile {
    height: number;
    highestBrickIndex: number | undefined;
  }

  const floor: FloorTile[][] =
    Array(bnds.maxX - bnds.minX + 1)
      .fill(undefined).map(() =>
        Array(bnds.maxY - bnds.minY + 1)
          .fill(undefined)
          .map(() => ({ height: 0, highestBrickIndex: undefined }))
    );
  
  for (const [brickIndex, brick] of orderByZ(bricks).entries()) {
    const horizontalProjectionFloorTiles = horizontalProjection(brick).map(({ x, y }) => floor[x][y]);

    const prevMaxHeight = Math.max(...horizontalProjectionFloorTiles.map((ft) => ft.height));
    const currMaxHeight = prevMaxHeight + (brick.point2.z - brick.point1.z + 1)

    for (const floorTile of horizontalProjectionFloorTiles) {
      if (
        floorTile.height === prevMaxHeight &&
        floorTile.highestBrickIndex !== undefined &&
        !brick.supportedBy.includes(floorTile.highestBrickIndex)
      ) {
        brick.supportedBy.push(floorTile.highestBrickIndex);
      }
      floorTile.height = currMaxHeight;
      floorTile.highestBrickIndex = brickIndex;
    }
  }

  return bricks;
}

function removableCount(bricks: Brick[]): number {
  return Array(bricks.length).fill(undefined).map((_, i) => i).filter((index) => {
    // alone in supported by
    return bricks.find((b) => b.supportedBy.length === 1 && b.supportedBy[0] === index) === undefined;
  }).length;
}

export function day22part1(input: string): number {
  return removableCount(drop(parseInput(input)));
}
