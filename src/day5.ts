export interface Range {
  start: number;
  length: number;
}

export interface MapRange {
  destinationStart: number;
  sourceStart: number;
  rangeLength: number;
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
    rangeLength: numbers[2],
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

function mapRange(input: number, range: MapRange): number | undefined {
  if (range.sourceStart <= input && input <= range.sourceStart + range.rangeLength - 1) {
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

function expandSeedRanges(seeds: number[]): Range[] {
  const ranges: Range[] = [];

  for (let i = 0; i < seeds.length; i += 2) {
    ranges.push({ start: seeds[i], length: seeds[i + 1] });
  }

  return ranges;
}

export function intersectAndMapRange(input: Range, mapRange: MapRange): [Range | undefined, Range, Range | undefined] | undefined {
  const [inputFirst, inputLast] = [input.start, input.start + input.length - 1];
  const [mapRangeFirst, mapRangeLast] = [mapRange.sourceStart, mapRange.sourceStart + mapRange.rangeLength - 1];

  if (
    inputFirst > mapRangeLast || // input above mapRange
    inputLast < mapRangeFirst // input below mapRange
  ) {
    return;
  } else {
    return [
      (inputFirst < mapRangeFirst) ? {
        start: inputFirst,
        length: mapRangeFirst - inputFirst,
      } : undefined,
      (inputFirst < mapRangeFirst) ? {
        start: mapRange.destinationStart,
        length: mapRangeLast < inputLast ? mapRangeLast - mapRangeFirst + 1 : inputLast - mapRangeFirst + 1,
      } : {
        start: mapRange.destinationStart + (inputFirst - mapRange.sourceStart),
        length: mapRangeLast < inputLast ? mapRangeLast - inputFirst + 1 : inputLast - inputFirst + 1,
      },
      (inputLast > mapRangeLast) ? {
        start: mapRangeLast + 1,
        length: inputLast - mapRangeLast,
      } : undefined
    ];
  }
}

function intersectMap(input: Range, map: Map): Range[] { 
  function intersectMapRec(mapRanges: MapRange[], acc: Array<Range | undefined>, leftover: Range | undefined) {
    const [mapRange, ...rest] = mapRanges;

    if (JSON.stringify(mapRanges.sort((a, b) => a.sourceStart - b.sourceStart)) !== JSON.stringify(mapRanges)) {
      throw new Error("Not sorted");      
    }

    if (mapRange === undefined || leftover === undefined) {
      return ([...acc, leftover].filter((a) => a !== undefined) as Range[]).sort((a, b) => a.start - b.start);
    } else {
      const intersections = intersectAndMapRange(input, mapRange);

      if (intersections !== undefined) {
        const [beforeMatch, match, afterMatch] = intersections;
        return intersectMapRec(rest, [...acc, beforeMatch, match], afterMatch);
      } else {
        return intersectMapRec(rest, acc, leftover);
      }
    }
  }

  return intersectMapRec(map, [], input);
}

function flatMapRanges(inputs: Range[], map: Map): Range[] {
  return inputs.flatMap((i) => intersectMap(i, map));
}

export function findSeedRangeLocations(seedRange: Range, almanac: Almanac): Range[] {
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

  return Math.min(...(expandSeedRanges(almanac.seeds).flatMap((s) => findSeedRangeLocations(s, almanac)).map((sr) => sr.start)));
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