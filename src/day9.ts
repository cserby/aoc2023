export function* differences(series: number[]): Generator<number, void, unknown> {
  for (let i = 0; i < series.length - 1; i++) {
    yield series[i + 1] - series[i];
  }
  return;
}

export function predict(series: number[]): number {
  if (series.every((n) => n === 0)) {
    return 0;
  }

  return predict([...differences(series)]) + (series.at(-1) ?? 0);
}

export function day9part1(input: string): number {
  const lines = input.split("\n");

  return lines
    .map((l) => l.split(" ").map((n) => parseInt(n)))
    .map(predict)
    .reduce((a, b) => a + b, 0);
}