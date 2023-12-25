export function parseInput(input: string): Record<string, string[]> {
  const conns = {} as Record<string, string[]>;
  for (const line of input.split("\n")) {
    const [label, connections] = line.split(": ");
    for (const other of connections.split(" ")) {
      conns[other] = [...(conns[other] ?? []), label];
      conns[label] = [...(conns[label] ?? []), other];
    }
  }
  return conns;
}

function reachable(conns: Record<string, string[]>): number {
  const reachable: string[] = [];

  const toCheck = [Object.keys(conns)[0]];

  while (toCheck.length > 0) {
    const checking = toCheck.pop()!;

    if (!reachable.includes(checking)) {
      reachable.push(checking);
    }

    for (const other of conns[checking]) {
      if (!toCheck.includes(other) && !reachable.includes(other)) {
        toCheck.push(other);
      }
    }
  }

  return reachable.length;
}

function remove(conns: Record<string, string[]>, edges: [string, string][]): Record<string, string[]> {
  return Object.entries(conns).reduce((prev, [label, destinations]) => {
    prev[label] = []
    for (const dest of destinations) {
      if (edges.find(([from, to]) => (from === label && to === dest) || (from === dest && to === label)) !== undefined) {
        continue;
      } else {
        prev[label].push(dest);
      }
    }
    return prev;
  }, {} as Record<string, string[]>);
}

export function day25part1(input: string, edgesToRemove: [string, string][] = [
  // Used graphviz with neato layout to see the three edges connecting the two subgraphs
  ["fbd", "lzd"],
  ["fxn", "ptq"],
  ["kcn", "szl"],
]): number {
  const conns = parseInput(input);

  const split = remove(conns, edgesToRemove);

  const vertexCount = Object.keys(conns).length;

  const subVertextCount = reachable(split);

  return (vertexCount - subVertextCount) * subVertextCount;
}
