import DefaultMap from "mnemonist/default-map";

export interface Turn {
  readonly guess: string;
  readonly cows: number;
  readonly bulls: number;
}

export function makeEducatedGuess(
  turns: Iterable<Turn>,
  solutionSpace: Set<string>
) {
  let bullsCount = new DefaultMap<string, number>(() => 0);
  let cowsCount = new DefaultMap<string, number>(() => 0);

  for (const { bulls, cows, guess } of turns) {
    for (const key of guess) {
      increment(bullsCount, key, bulls);
      increment(cowsCount, key, cows);
    }
  }

  let alternatives = [];
  let maxScore = null;
  for (const solution of solutionSpace) {
    let solutionScore = 0;

    for (const key of solution)
      solutionScore -= cowsCount.get(key) - bullsCount.get(key);

    if (solutionScore === maxScore) alternatives.push(solution);

    if (maxScore === null || solutionScore > maxScore) {
      alternatives = [solution];
      maxScore = solutionScore;
    }
  }

  const guess = Math.floor(Math.random() * alternatives.length);

  return alternatives[guess];
}

function increment(map: DefaultMap<string, number>, key: string, amount = 1) {
  const currentValue = map.get(key);
  map.set(key, currentValue + amount);
}
