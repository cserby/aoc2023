export function HASH(str: string): number {
  return [...str].reduce((prevHsh, currChar) => {
    return ((prevHsh + currChar.charCodeAt(0)) * 17) % 256
  }, 0);
}

export function day15part1(input: string): number {
  return input.split(",").map(HASH).reduce((a, b) => a + b);
}

export function day15part2(input: string): number {
  interface Lens {
    label: string;
    value: number;
  }
  interface State {
    ignoredLabels: string[];
    lenses: Lens[];
  }
  return input.split(",").reverse().reduce(
    (prevState, instruction) => {
      if (instruction.endsWith("-")) {
        return {
          ignoredLabels: [...prevState.ignoredLabels, instruction.slice(undefined, -1)],
          lenses: prevState.lenses,
        }
      } else {
        const [label, valueStr] = instruction.split("=");
        const prevLens = prevState.lenses.find((l) => l.label === label);
        if (prevState.ignoredLabels.includes(label)) {
          return prevState;
        } else if (prevLens !== undefined) {
          return {
            ignoredLabels: prevState.ignoredLabels,
            lenses: [{
              label,
              value: prevLens.value,
            }, ...prevState.lenses.filter((l) => l.label !== label)],
          }; // Move to the front
        } else {
          return {
            ignoredLabels: prevState.ignoredLabels,
            lenses: [{
              label,
              value: parseInt(valueStr),
            }, ...prevState.lenses]
          };
        }
      }
    },
    {
      ignoredLabels: [],
      lenses: [],
    } as State
  ).lenses.reduce((prevBoxes, currLens) => {
    prevBoxes[HASH(currLens.label)].push(currLens.value);
    return prevBoxes;
  }, Array(256).fill(undefined).map(() => [] as number[]))
    .map((box, boxIndex, _boxes) => {
      return box.map((lensValue, lensIndex) => (boxIndex + 1) * (lensIndex + 1) * lensValue)
        .reduce((a, b) => a + b, 0)
    })
    .reduce((a, b) => a + b, 0);
}
