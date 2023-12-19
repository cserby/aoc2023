type PartAttr = "x" | "m" | "a" | "s";

type Part = Record<PartAttr, number>;

type Rule = (p: Part) => string | undefined

interface Puzzle {
  workflows: Record<string, Rule[]>;
  parts: Part[];
}

function parseRule(ruleStr: string): Rule {
  if (ruleStr.includes(":")) {
    const [condition, targetLabel] = ruleStr.split(":");
    const partAttr = condition.slice(undefined, 1) as PartAttr;
    const comp = condition.slice(1, 2) as "<" | ">";
    const numb = parseInt(condition.slice(2));

    switch (comp) {
      case "<": return (p: Part) => p[partAttr] < numb ? targetLabel : undefined;
      case ">": return (p: Part) => p[partAttr] > numb ? targetLabel : undefined;
      default: throw new Error(`? '${ruleStr}`);
    }
  } else {
    return (_p: Part) => ruleStr;
  }
}

function parseWorkflow(line: string): [string, Rule[]] {
  const rulesStartIndex = line.indexOf("{");
  const label = line.slice(undefined, rulesStartIndex);
  const rulesPart = line.slice(rulesStartIndex + 1, line.length - 1);

  return [label, rulesPart.split(",").map(parseRule)];
}

function parsePart(line: string): Part {
  const [x, m, a, s] = line.slice(1, -1).split(",").map((pp) => {
    const [_var, value] = pp.split("=");
    return parseInt(value);
  });

  return { x, m, a, s };
}

export function parseInput(input: string): Puzzle {
  const [chainLines, partLines] = input.split("\n\n");

  return {
    workflows: chainLines.split("\n")
      .map(parseWorkflow)
      .reduce((prevChains, [currChainLabel, currChainRules]) => {
        prevChains[currChainLabel] = currChainRules;
        return prevChains;
      }, {} as Record<string, Rule[]>),
    parts: partLines.split("\n")
      .map(parsePart),
  }
}

export function apply(part: Part, puzzle: Puzzle): "A" | "R" {
  let currWorkflow = "in";

  while (currWorkflow != "A" && currWorkflow != "R") {
    for (const rule of puzzle.workflows[currWorkflow]) {
      const nextWorkflow = rule(part);
      if (nextWorkflow === undefined) {
        continue;
      } else {
        currWorkflow = nextWorkflow;
        break;
      }
    }
  }

  return currWorkflow;
}

export function day19part1(input: string): number {
  const puzzle = parseInput(input);

  const accepted = puzzle.parts.filter((p) => apply(p, puzzle) === "A");

  return accepted.map((p) => Object.values(p).reduce((a, b) => a + b), 0).reduce((a, b) => a + b, 0);
}
