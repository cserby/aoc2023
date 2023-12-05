export interface Range {
  start: number;
  end: number;
}

export interface MapRange {
  destinationStart: number;
  sourceStart: number;
  sourceEnd: number;
}

type Map = MapRange[];

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

function parseRange(line: string): MapRange {
  const numbers = line.split(" ").map(stringToNumber);

  return {
    destinationStart: numbers[0],
    sourceStart: numbers[1],
    sourceEnd: numbers[1] + numbers[2] - 1,
  };
}

function parseMap(chapter: string, heading: string): Map {
  const lines = chapter.split("\n");

  if (lines[0] !== heading) {
    throw new Error(`Chapter with unexpected heading: ${lines[0]}`);
  }

  return lines.slice(1).map(parseRange).sort((a, b) => a.sourceStart - b.sourceStart);
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

function mapNumberRange(input: number, range: MapRange): number | undefined {
  if (range.sourceStart <= input && input <= range.sourceEnd) {
    return range.destinationStart + (input - range.sourceStart);
  } else {
    return;
  }
}

function mapNumber(input: number, map: Map): number {
  return map.reduce((prevReturn, currRange) => {
    const mapped = mapNumberRange(input, currRange);
    if (mapped !== undefined) {
      return mapped;
    } else {
      return prevReturn;
    }
  }, input);
}

function findSeedLocation(seed: number, almanac: Almanac): number {
  return mapNumber(
    mapNumber(
      mapNumber(
        mapNumber(
          mapNumber(
            mapNumber(
              mapNumber(seed, almanac.seedToSoil), almanac.soilToFertilizer),
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

function expandSeedRanges(seeds: number[]): Range[] {
  const ranges: Range[] = [];

  for (let i = 0; i < seeds.length; i += 2) {
    ranges.push({ start: seeds[i], end: seeds[i] + seeds[i + 1] - 1 });
  }

  return ranges;
}

export function intersectAndMapRange(input: Range, mapRange: MapRange): [Range | undefined, Range | undefined, Range | undefined] {
  const [inputFirst, inputLast] = [input.start, input.end];
  const [mapRangeFirst, mapRangeLast] = [mapRange.sourceStart, mapRange.sourceEnd];

  if (
    inputFirst > mapRangeLast
  ) {
    return [undefined, undefined, input];
  } else if (
    inputLast < mapRangeFirst // input below mapRange
  ) {
    return [input, undefined, undefined];
  } else {
    return [
      (inputFirst < mapRangeFirst) ? {
        start: inputFirst,
        end: mapRangeFirst - 1,
      } : undefined,
      {
        start: Math.max(inputFirst, mapRangeFirst) + (mapRange.destinationStart - mapRange.sourceStart),
        end: Math.min(mapRangeLast, inputLast) + (mapRange.destinationStart - mapRange.sourceStart),
      },
      (inputLast > mapRangeLast) ? {
        start: mapRangeLast + 1,
        end: inputLast,
      } : undefined
    ];
  }
}

function mapRange(input: Range, map: Map): Range[] { 
  function intersectMapRec([mapRange, ...rest]: MapRange[], acc: Array<Range | undefined>, leftover: Range | undefined) {
    if (mapRange === undefined || leftover === undefined) {
      return ([...acc, leftover].filter((a) => a !== undefined) as Range[]);
    } else {
      const [beforeMatch, match, afterMatch] = intersectAndMapRange(leftover, mapRange);
      return intersectMapRec(rest, [...acc, beforeMatch, match], afterMatch);
    }
  }

  return intersectMapRec(map, [], input);
}

function flatMapRanges(inputs: Range[], map: Map): Range[] {
  return inputs.flatMap((i) => mapRange(i, map));
}

export function seedRangeToLocations(seedRange: Range, almanac: Almanac): Range[] {
  return flatMapRanges(
    flatMapRanges(
      flatMapRanges(
        flatMapRanges(
          flatMapRanges(
            flatMapRanges(
              flatMapRanges(
                [seedRange],
                almanac.seedToSoil
              ), almanac.soilToFertilizer
            ), almanac.fertilizerToWater
          ), almanac.waterToLight
        ), almanac.lightToTemperature
      ), almanac.temperatureToHumidity
    ), almanac.humidityToLocation
  );
}

export function day5part2(input: string): number {
  const almanac = parseInput(input);

  return Math.min(...(expandSeedRanges(almanac.seeds).flatMap((s) => seedRangeToLocations(s, almanac)).map((sr) => sr.start)));
}

function expandSeedRangesNaive(seeds: number[]): number[] {
  const ss = [] as number[];

  for (let i = 0; i < seeds.length; i += 2) {
    for (let j = seeds[i]; j < seeds[i] + seeds[i+1]; j++) {
      ss.push(j);
    }
  }
  return ss;
}

export function day5part2naive(input: string): number {
  const almanac = parseInput(input);

  return Math.min(...expandSeedRangesNaive(almanac.seeds).map((s) => findSeedLocation(s, almanac)));
}