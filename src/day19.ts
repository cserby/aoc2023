type PartAttr = "x" | "m" | "a" | "s";

export type Part = Record<PartAttr, number>;

type Rule = (p: Part) => string | undefined

interface Puzzle {
  workflows: Record<string, Rule[]>;
  parts: Part[];
}

export function parseInput(input: string): Puzzle {
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

type Rule2 = {
  target: string;
  comp?: "<" | ">";
  partAttr?: PartAttr;
  numb?: number;
};

type Workflow2 = Rule2[];
type Puzzle2 = Record<string, Workflow2>;

export function parseInput2(input: string): Puzzle2 {
  function parseRule(ruleStr: string): Rule2 {
    if (ruleStr.includes(":")) {
      const [condition, target] = ruleStr.split(":");
      const partAttr = condition.slice(undefined, 1) as PartAttr;
      const comp = condition.slice(1, 2) as "<" | ">";
      const numb = parseInt(condition.slice(2));
  
      return { target, comp, numb, partAttr};
    } else {
      return { target: ruleStr };
    }
  }

  function parseWorkflow(line: string): [string, Workflow2] {
    const rulesStartIndex = line.indexOf("{");
    const label = line.slice(undefined, rulesStartIndex);
    const rulesPart = line.slice(rulesStartIndex + 1, line.length - 1);
  
    return [label, rulesPart.split(",").map(parseRule)];
  }

  const [workflowsPart, _partsPart] = input.split("\n\n");

  return workflowsPart.split("\n")
    .map(parseWorkflow)
    .reduce((prevWorkflows, [currLabel, currRules]) => {
      prevWorkflows[currLabel] = currRules;
      return prevWorkflows;
    }, {} as Record<string, Workflow2>);
}

export type Domain = Record<PartAttr, { "<": number; ">": number }>;

export function apply2(domain: Domain, rule: Rule2): [string, Domain, Domain | undefined] {
  if (rule.comp === undefined) {
    return [rule.target, deepcopy(domain), undefined];
  } else {
    const newDomain = deepcopy(domain);
    const remainder = deepcopy(domain);

    switch (rule.comp) {
      case "<": {
        newDomain[rule.partAttr!]["<"] = Math.min(newDomain[rule.partAttr!]["<"], rule.numb!);
        remainder[rule.partAttr!][">"] = Math.max(domain[rule.partAttr!][">"], rule.numb! - 1);
        break;
      }
      case ">": {
        newDomain[rule.partAttr!][">"] = Math.max(newDomain[rule.partAttr!][">"], rule.numb!);
        remainder[rule.partAttr!]["<"] = Math.min(domain[rule.partAttr!]["<"], rule.numb! + 1);
        break;
      }
    }
    return [rule.target, newDomain, remainder];
  }
}

function deepcopy<T>(a: T): T {
  return JSON.parse(JSON.stringify(a)) as T;
}

export function acceptedDomains(input: string): Domain[] {
  const puzzle = parseInput2(input);

  const domains: Record<string, Domain[]> = {};

  let evaluate: [string, Domain][] = [["in", {
    "x": { ">": 0, "<": 4001 },
    "m": { ">": 0, "<": 4001 },
    "a": { ">": 0, "<": 4001 },
    "s": { ">": 0, "<": 4001 },
  }]];

  const beenThereDoneThat: string[] = [];

  while (evaluate.length > 0) {
    const [workflowLabel, domain] = evaluate.pop()!;

    domains[workflowLabel] = [...(domains[workflowLabel] ?? []), deepcopy(domain)];

    if (workflowLabel === "A" || workflowLabel === "R") {
      continue;
    }

    let remainderDomain: Domain | undefined = deepcopy(domain);
    for (const rule of puzzle[workflowLabel]) {
      if (remainderDomain === undefined) {
        throw new Error("???");
      }
      const [newLabel, newDomain, remDmn] = apply2(remainderDomain, rule);

      const stateStr = `${newLabel};${JSON.stringify(newDomain)}`;
      if (!beenThereDoneThat.includes(stateStr)) {
        evaluate.push([newLabel, newDomain]);
        beenThereDoneThat.push(stateStr);
      }

      remainderDomain = remDmn;
    }
  }

  return domains["A"];
}

type DomArray = [number, number, number, number, number, number, number, number];

function toDomArray(d: Domain): DomArray {
  // box-intersect works with closed ranges
  // Domain describes an open range, so need to convert here
  return [
    d.x[">"] + 1, d.x["<"] - 1, // (0, 4001) => [1, 4000]
    d.m[">"] + 1, d.m["<"] - 1,
    d.a[">"] + 1, d.a["<"] - 1,
    d.s[">"] + 1, d.s["<"] - 1,
  ];
}

function intersect(a: DomArray, b: DomArray): DomArray | undefined {
  // Closed ranges
  const [ax1, ax2, am1, am2, aa1, aa2, as1, as2] = a;
  const [bx1, bx2, bm1, bm2, ba1, ba2, bs1, bs2] = b;

  if ( // [z, y] does not intersect [q, p] if z > p || y < q
    ax1 > bx2 || ax2 < bx1 ||//no intersection in x
    am1 > bm2 || am2 < bm1 ||
    aa1 > ba2 || aa2 < ba1 ||
    as1 > bs2 || as2 < bs1
  ) {
    // No intersection
    return;
  } else {
    return [
      Math.max(ax1, bx1), Math.min(ax2, bx2),
      Math.max(am1, bm1), Math.min(am2, bm2),
      Math.max(aa1, ba1), Math.min(aa2, ba2),
      Math.max(as1, bs1), Math.min(as2, bs2),
    ]
  }
}

function calculateDomainVolume(domArray: DomArray): number {
  const [x1, x2, m1, m2, a1, a2, s1, s2] = domArray;

  // closed ranges: [1, 4000] => 4000 - 1 + 1
  return (x2 - x1 + 1) * (m2 - m1 + 1) * (a2 - a1 + 1) * (s2 - s1 + 1);
}

function allIntersections(domArrays: DomArray[]): DomArray[] {
  const ret: DomArray[] = [];

  for (let i = 0; i < domArrays.length - 1; i++) {
    for (let j = i + 1; j < domArrays.length; j++) {
      const intrs = intersect(domArrays[i], domArrays[j]);
      if (intrs !== undefined) {
        ret.push(intrs);
      }
    }
  }

  return ret;
}

function calculateTotalVolume(domArrays: DomArray[]): number {
  if (domArrays.length === 0) return 0;

  let volume = domArrays.map(calculateDomainVolume).reduce((a, b) => a + b, 0);

  let sign = -1;

  let intersections = deepcopy(domArrays);

  while(true) {
    intersections = deepcopy(allIntersections(intersections));
    
    if (intersections.length === 0) break;
    
    const intersectionVol = intersections.map(calculateDomainVolume).reduce((a, b) => a + b, 0);

    volume += sign * intersectionVol;
    sign *= -1;
  }

  return domArrays.map(calculateDomainVolume).reduce((a, b) => a + b, 0) - calculateTotalVolume(intersections);
}

export function day19part2(input: string): number {
  return calculateTotalVolume(acceptedDomains(input).map(toDomArray));
}
