type Card = "A" | "K" | "Q" | "J" | "T" | "9" | "8" | "7" | "6" | "5" | "4" | "3" | "2";

export interface Hand {
  cards: Card[];
  bid: number;
  cardCounts: Record<Card, number>;
}

function count<T extends string | number>(arr: Array<T>): Record<T, number> {
  return arr.reduce((prevCounts, currItem) => {
    if (prevCounts[currItem] === undefined) {
      prevCounts[currItem] = 1;
    } else {
      prevCounts[currItem]++;
    }
    return prevCounts;
  }, {} as Record<T, number>)
}

export function parseHand(line: string): Hand {
  const [cs, bid] = line.split(" ");
  const cards = [...cs] as Card[];

  return {
    cards,
    bid: parseInt(bid),
    cardCounts: count(cards),
  }
}

export function parseInput(input: string): Hand[] {
  return input.split("\n").map(parseHand);
}

function hasACardWithCount(h: Hand, count: number, useJokers: boolean): boolean {
  if (!useJokers) {
    return Object.values(h.cardCounts).find((c) => c === count) !== undefined;
  } else {
    const { J, ...others } = h.cardCounts;
    return J >= count || Object.values(others).find((c) => c + (J ?? 0) >= count) !== undefined;
  }
}

function fiveOfAKind(h: Hand, useJokers: boolean): boolean {
  return hasACardWithCount(h, 5, useJokers);
}

export function fourOfAKind(h: Hand, useJokers: boolean): boolean {
  return hasACardWithCount(h, 4, useJokers);
}

export function fullHouse(h: Hand, useJokers: boolean): boolean {
  if (!useJokers) {
    return hasACardWithCount(h, 3, useJokers) && hasACardWithCount(h, 2, useJokers);
  } else {
    const { J, ...others } = h.cardCounts;

    if (J === 3) {
      return true; //JJJ
    } else if (J === 2) {
      return count(Object.values(others))[2] > 0; //JJXXz
    } else if (J === 1) {
      return count(Object.values(others))[2] == 2; //Jxyzv
    } else {
      return fullHouse(h, false);
    }
  }
}

export function threeOfAKind(h: Hand, useJokers: boolean): boolean {
  return hasACardWithCount(h, 3, useJokers);
}

export function twoPairs(h: { cardCounts: Record<Card, number> }, useJokers: boolean): boolean {
  if (!useJokers) {
    return count(Object.values(h.cardCounts))[2] == 2;
  } else {
    const { J, ...others } = h.cardCounts;

    if (J == 2) { // can't be more, as then we'd have at least threeOfAKind
      return true; // JJxyz
    } else if (J == 1) {
      return count(Object.values(others))[2] > 0; // JXXyz
    } else { // J == 0
      return twoPairs(h, false);
    }
  }
}

function onePair(h: Hand, useJokers: boolean): boolean {
  return hasACardWithCount(h, 2, useJokers);
}

function mapCardsToStrength(cards: Card[], useJokers: boolean): string {
  const cardToStrength: Record<Card, string> = {
    "A": "a",
    "K": "b",
    "Q": "c",
    "J": useJokers ? "n" : "d",
    "T": "e",
    "9": "f",
    "8": "g",
    "7": "h",
    "6": "i",
    "5": "j",
    "4": "k",
    "3": "l",
    "2": "m",
  };

  return cards.reduce((prevStr, currCard) => `${prevStr}${cardToStrength[currCard]}`, "");
}

function compareBasedOnCardStrength(a: Hand, b: Hand, useJokers: boolean): number {
  return -1 * mapCardsToStrength(a.cards, useJokers).localeCompare(mapCardsToStrength(b.cards, useJokers))
}

export function compareHands(a: Hand, b: Hand, useJokers = false): number {
  if (fiveOfAKind(a, useJokers) || fiveOfAKind(b, useJokers)) {
    if (fiveOfAKind(a, useJokers) && fiveOfAKind(b, useJokers)) {
      return compareBasedOnCardStrength(a, b, useJokers);
    } else {
      return fiveOfAKind(a, useJokers) ? 1 : -1;
    }
  } else if (fourOfAKind(a, useJokers) || fourOfAKind(b, useJokers)) {
    if (fourOfAKind(a, useJokers) && fourOfAKind(b, useJokers)) {
      return compareBasedOnCardStrength(a, b, useJokers);
    } else {
      return fourOfAKind(a, useJokers) ? 1 : -1;
    }
  } else if (fullHouse(a, useJokers) || fullHouse(b, useJokers)) {
    if (fullHouse(a, useJokers) && fullHouse(b, useJokers)) {
      return compareBasedOnCardStrength(a, b, useJokers);
    } else {
      return fullHouse(a, useJokers) ? 1 : -1;
    }
  } else if (threeOfAKind(a, useJokers) || threeOfAKind(b, useJokers)) {
    if (threeOfAKind(a, useJokers) && threeOfAKind(b, useJokers)) {
      return compareBasedOnCardStrength(a, b, useJokers);
    } else {
      return threeOfAKind(a, useJokers) ? 1 : -1;
    }
  } else if (twoPairs(a, useJokers) || twoPairs(b, useJokers)) {
    if (twoPairs(a, useJokers) && twoPairs(b, useJokers)) {
      return compareBasedOnCardStrength(a, b, useJokers);
    } else {
      return twoPairs(a, useJokers) ? 1 : -1;
    }
  } else if (onePair(a, useJokers) || onePair(b, useJokers)) {
    if (onePair(a, useJokers) && onePair(b, useJokers)) {
      return compareBasedOnCardStrength(a, b, useJokers);
    } else {
      return onePair(a, useJokers) ? 1 : -1;
    }
  } else {
    return compareBasedOnCardStrength(a, b, useJokers);
  }
}

export function scoreHand(h: Hand, rank: number): number {
  return h.bid * rank;
}

export function day7part1(input: string): number {
  return parseInput(input).sort(compareHands).reduce((prevWinning, currHand, currIndex, _cardsSorted) => prevWinning + scoreHand(currHand, currIndex + 1), 0);
}

export function day7part2(input: string): number {
  return parseInput(input).sort((a, b) => compareHands(a, b, true)).reduce((prevWinning, currHand, currIndex, _cardsSorted) => prevWinning + scoreHand(currHand, currIndex + 1), 0);
}