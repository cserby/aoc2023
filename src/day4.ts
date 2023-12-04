export interface Card {
  id: number;
  winning: number[];
  numbers: number[];
}

export function parseCard(line: string): Card {
  const [cardNum, numSpec] = line.split(": ");
  const [_card, cardIdStr] = cardNum.split(/ +/);
  const [winningNums, cardNums] = numSpec.split(" | ");

  return {
    id: parseInt(cardIdStr),
    winning: winningNums.split(/ +/).map((w) => parseInt(w)),
    numbers: cardNums.split(/ +/).map((n) => parseInt(n)),
  }
}

export function scoreCard(card: Card): number {
  return card.winning.reduce((prevScore, winningNum) => {
    if (card.numbers.includes(winningNum)) {
      if (prevScore > 0) {
        return prevScore * 2;
      } else {
        return 1;
      }
    } else {
      return prevScore;
    }
  }, 0)
}

export function day4part1(input: string): number {
  const cards = input.split("\n").map(parseCard);

  const cardScores = cards.map(scoreCard);

  return cardScores.reduce((acc, curr) => acc + curr, 0);
}