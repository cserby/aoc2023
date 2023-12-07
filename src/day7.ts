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

function hasACardWithCount(h: Hand, count: number): boolean {
  return Object.values(h.cardCounts).find((c) => c === count) !== undefined;
}

function fiveOfAKind(h: Hand): boolean {
  return hasACardWithCount(h, 5);
}

function fourOfAKind(h: Hand): boolean {
  return hasACardWithCount(h, 4);
}

function fullHouse(h: Hand): boolean {
  return hasACardWithCount(h, 3) && hasACardWithCount(h, 2);
}

function threeOfAKind(h: Hand): boolean {
  return hasACardWithCount(h, 3);
}

function twoPairs(h: Hand): boolean {
  return count(Object.values(h.cardCounts))[2] == 2;
}

function onePair(h: Hand): boolean {
  return hasACardWithCount(h, 2);
}

function mapCardsToStrength(cards: Card[]): string {
  const cardToStrength: Record<Card, string> = {
    "A": "a",
    "K": "b",
    "Q": "c",
    "J": "d",
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

function compareBasedOnCardStrength(a: Hand, b: Hand): number {
  return -1 * mapCardsToStrength(a.cards).localeCompare(mapCardsToStrength(b.cards))
}

export function compareHands(a: Hand, b: Hand): number {
  if (fiveOfAKind(a) || fiveOfAKind(b)) {
    if (fiveOfAKind(a) && fiveOfAKind(b)) {
      return compareBasedOnCardStrength(a, b);
    } else {
      return fiveOfAKind(a) ? 1 : -1;
    }
  } else if (fourOfAKind(a) || fourOfAKind(b)) {
    if (fourOfAKind(a) && fourOfAKind(b)) {
      return compareBasedOnCardStrength(a, b);
    } else {
      return fourOfAKind(a) ? 1 : -1;
    }
  } else if (fullHouse(a) || fullHouse(b)) {
    if (fullHouse(a) && fullHouse(b)) {
      return compareBasedOnCardStrength(a, b);
    } else {
      return fullHouse(a) ? 1 : -1;
    }
  } else if (threeOfAKind(a) || threeOfAKind(b)) {
    if (threeOfAKind(a) && threeOfAKind(b)) {
      return compareBasedOnCardStrength(a, b);
    } else {
      return threeOfAKind(a) ? 1 : -1;
    }
  } else if (twoPairs(a) || twoPairs(b)) {
    if (twoPairs(a) && twoPairs(b)) {
      return compareBasedOnCardStrength(a, b);
    } else {
      return twoPairs(a) ? 1 : -1;
    }
  } else if (onePair(a) || onePair(b)) {
    if (onePair(a) && onePair(b)) {
      return compareBasedOnCardStrength(a, b);
    } else {
      return onePair(a) ? 1 : -1;
    }
  } else {
    return compareBasedOnCardStrength(a, b);
  }
}

export function scoreHand(h: Hand, rank: number): number {
  return h.bid * rank;
}

export function day7part1(input: string): number {
  return parseInput(input).sort(compareHands).reduce((prevWinning, currHand, currIndex, _cardsSorted) => prevWinning + scoreHand(currHand, currIndex + 1), 0);
}