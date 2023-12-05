export interface Range {
  destinationStart: number;
  sourceStart: number;
  rangeLength: number;
}

type Map = Range[];

export interface Almanac {
  seeds: number[];
  seedToSoil: Map;
  soilToFertilizer: Map;
  fertilizerToWater: Map;
  waterToLight: Map;
  lightToTemperature: Map;
  temperatureToHumidity: Map;
  humidityToLocation: Map;
}

function stringToNumber(str: string): number {
  return parseInt(str);
}

function parseRange(line: string): Range {
  const numbers = line.split(" ").map(stringToNumber);

  return {
    destinationStart: numbers[0],
    sourceStart: numbers[1],
    rangeLength: numbers[2],
  };
}

function parseMap(chapter: string, heading: string): Map {
  const lines = chapter.split("\n");

  if (lines[0] !== heading) {
    throw new Error(`Chapter with unexpected heading: ${lines[0]}`);
  }

  return lines.slice(1).map(parseRange);
}

export function parseInput(input: string): Almanac {
  const chapters = input.split("\n\n");

  const seeds = chapters[0].split(": ")[1].split(" ").map(stringToNumber);

  return {
    seeds,
    seedToSoil: parseMap(chapters[1], "seed-to-soil map:"),
    soilToFertilizer: parseMap(chapters[2], "soil-to-fertilizer map:"),
    fertilizerToWater: parseMap(chapters[3], "fertilizer-to-water map:"),
    waterToLight: parseMap(chapters[4], "water-to-light map:"),
    lightToTemperature: parseMap(chapters[5], "light-to-temperature map:"),
    temperatureToHumidity: parseMap(chapters[6], "temperature-to-humidity map:"),
    humidityToLocation: parseMap(chapters[7], "humidity-to-location map:"),
  } satisfies Almanac
}

function mapRange(input: number, range: Range): number | undefined {
  if (range.sourceStart <= input && input <= range.sourceStart + range.rangeLength) {
    return range.destinationStart + (input - range.sourceStart);
  } else {
    return;
  }
}

function map(input: number, map: Map): number {
  return map.reduce((prevReturn, currRange) => {
    const mapped = mapRange(input, currRange);
    if (mapped !== undefined) {
      return mapped;
    } else {
      return prevReturn;
    }
  }, input);
}

function findSeedLocation(seed: number, almanac: Almanac): number {
  return map(
    map(
      map(
        map(
          map(
            map(
              map(seed, almanac.seedToSoil), almanac.soilToFertilizer),
              almanac.fertilizerToWater
          ), almanac.waterToLight
        ), almanac.lightToTemperature
      ), almanac.temperatureToHumidity
    ), almanac.humidityToLocation
  );
}

export function day5part1(input: string): number {
  const almanac = parseInput(input);

  return Math.min(...almanac.seeds.map((s) => findSeedLocation(s, almanac)));
}