type GameId = number;

export interface Draw {
  red: number;
  green: number;
  blue: number;
}

interface Game {
  id: GameId;
  draws: Draw[];
}

export function drawParser(drawStr: string): Draw {
  const draw = {
    red: 0,
    green: 0,
    blue: 0,
  };

  drawStr.split(", ").forEach((colorDraw) => {
    const [number, color] = colorDraw.split(" ");
    switch (color) {
      case "red": draw.red = parseInt(number); break;
      case "green": draw.green = parseInt(number); break;
      case "blue": draw.blue = parseInt(number); break;
    }
  });

  return draw;
}

export function drawPossible(draw: Draw, limit: Draw): boolean {
  return draw.red <= limit.red &&
    draw.green <= limit.green &&
    draw.blue <= limit.blue;
}

export function gamePossible(game: Game, colorLimits: Draw): GameId | undefined {
  if (game.draws.every((draw) => drawPossible(draw, colorLimits))) {
    return game.id;
  } else {
    return;
  }
}

export function gameParser(line: string): Game {
  const [gameId, drawsStr] = line.split(": ");
  const [_game, gameIdNumStr] = gameId.split(" ");
  const gameIdNum = parseInt(gameIdNumStr);

  const draws = drawsStr.split("; ").map(drawParser);

  return { id: gameIdNum, draws };
}

export function part1(input: string, limits: Draw): number {
  return input
    .split("\n")
    .map((line) => gamePossible(gameParser(line), limits))
    .reduce((acc, curr) => (acc ?? 0) + (curr ?? 0), 0) ?? 0;
}

export function gamePower(game: Game): number {
  const minRed = Math.max(...game.draws.map((d) => d.red));
  const minGreen = Math.max(...game.draws.map((d) => d.green));
  const minBlue = Math.max(...game.draws.map((d) => d.blue));

  return minRed * minGreen * minBlue;
}

export function part2(input: string): number {
  return input
    .split("\n")
    .map((line) => gamePower(gameParser(line)))
    .reduce((acc, curr) => (acc) + (curr), 0)
}