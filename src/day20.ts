type PulseType = "L" | "H";

type Network = Record<string, Module>;

type PulseCount = Record<PulseType, number>;

interface Pulse {
  from: string;
  to: string;
  type: PulseType;
}

interface Module {
  label: string;
  inputs: string[];
  outputs: string[];
  handle: (p: Pulse) => Pulse[];
  sendLow: () => Pulse[];
  sendHigh: () => Pulse[];
}

export function parseInput(input: string): Network {
  function parseModule(lineWithoutType: string): Omit<Module, "handle"> {
    const [label, outputsStr] = lineWithoutType.split(" -> ");
    return {
      label,
      outputs: outputsStr.split(", "),
      inputs: [],
      sendHigh() {
        return this.outputs.map((o) => ({
          from: this.label,
          to: o,
          type: "H",
        }));
      },
      sendLow() {
        return this.outputs.map((o) => ({
          from: this.label,
          to: o,
          type: "L",
        }));
      },
    };
  }

  function parseFlipFlop(line: string): Module {
    return {
      ...parseModule(line.slice(1)),
      state: false,
      handle(p) {
        if (p.type === "H") {
          return [];
        } else {
          if (this.state) {
            this.state = false;
            return this.sendLow();
          } else {
            this.state = true;
            return this.sendHigh();
          }
        }
      },
    } as Module & { state: boolean; };
  }
  
  function parseConjunction(line: string): Module {
    return {
      ...parseModule(line.slice(1)),
      inputs: [],
      prevPulses: {} as Record<string, PulseType>,
      handle(p) {
        this.prevPulses[p.from] = p.type;
        if (Object.keys(this.prevPulses).length !== this.inputs.length) {
          for (const input of this.inputs) {
            this.prevPulses[input] = this.prevPulses[input] ?? "L";
          }
        }

        if (Object.values(this.prevPulses).every((p) => p === "H")) {
          return this.sendLow();
        } else {
          return this.sendHigh();
        }
      },
    } as Module & { prevPulses: Record<string, PulseType> };
  }
  
  function parseBroadcaster(line: string): Module {
    return {
      ...parseModule(line),
      inputs: [],
      handle(p) {
        switch (p.type) {
          case "H": return this.sendHigh();
          case "L": return this.sendLow();
        }
      },
    };
  }

  function parseLine(line: string): Module {
    switch ([...line][0]) {
      case "&": return parseConjunction(line);
      case "%": return parseFlipFlop(line);
      case "b": return parseBroadcaster(line);
      default: throw new Error(`??? ${line}`);
    }
  }

  function nullModule(label: string): Module {
    return {
      label,
      inputs: [],
      outputs: [],
      handle: () => [],
      sendHigh: () => [],
      sendLow: () => [],
    };
  }

  function interconnect(ntw: Network): Network {
    for (const label of Object.keys(ntw)) {
      for (const output of ntw[label].outputs) {
        if (ntw[output] === undefined) {
          ntw[output] = nullModule(output);
        }
        ntw[output].inputs.push(label);
      }
    }

    return ntw;
  }

  return interconnect(input.split("\n").map(parseLine).reduce((prevNtw, currModule) => {
    prevNtw[currModule.label] = currModule;
    return prevNtw;
  }, {} as Network));
}

export function pushButton(ntw: Network, times: number = 1): [Network, PulseCount] {
  function pushButtonOnce(ntw: Network): [Network, PulseCount] {
    const pulses: Pulse[] = [{
      from: "button",
      to: "broadcaster",
      type: "L"
    }];

    const pulsesDone: Pulse[] = [];

    while (pulses.length > 0) {
      const pulse = pulses.pop()!;
      pulsesDone.push(pulse);

      pulses.push(...ntw[pulse.to].handle(pulse));
    }

    return [ntw, pulsesDone.reduce(
      (prevCount, currPulse) =>
        ({
        H: prevCount.H + (currPulse.type === "H" ? 1 : 0),
        L: prevCount.L + (currPulse.type === "L" ? 1 : 0),
      }), { H: 0, L: 0 })]; // +1 is the button press  
  }

  return Array(times).fill(undefined).reduce(([ntw, prevCounts], _) => {
    const [newNtw, pc] = pushButtonOnce(ntw);
    return [newNtw, { H: prevCounts.H + pc.H, L: prevCounts.L + pc.L }];
  }, [ntw, { H: 0, L: 0 }] as [Network, PulseCount]);
}

export function day20part1(input: string): number {
  const pc = pushButton(parseInput(input), 1000)[1];
  return pc.H * pc.L;
}
