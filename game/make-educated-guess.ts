import DefaultMap from "mnemonist/default-map";

export interface Turn {
  readonly guess: string;
  readonly cows: number;
  readonly bulls: number;
}

export function makeEducatedGuess(
  turns: Iterable<Turn>,
  solutionSpace: Iterable<string>
) {
  const symbolWeight = weighSymbols(turns);
  return makeGuess(symbolWeight, solutionSpace);
}

function weighSymbols(turns: Iterable<Turn>) {
  const symbolWeight = new DefaultMap<string, number>(() => 0);
  for (const { bulls, cows, guess } of turns) {
    for (const key of guess) {
      const currentWeight = symbolWeight.get(key);
      symbolWeight.set(key, currentWeight + bulls + cows);
    }
  }
  return symbolWeight;
}

function makeGuess(
  symbolWeight: DefaultMap<string, number>,
  solutionSpace: Iterable<string>
) {
  let alternatives = [],
    maxScore = null;
  for (const solution of solutionSpace) {
    let solutionScore = 0;

    for (const key of solution) solutionScore -= symbolWeight.get(key);

    if (solutionScore === maxScore) alternatives.push(solution);

    if (maxScore === null || solutionScore > maxScore) {
      alternatives = [solution];
      maxScore = solutionScore;
    }
  }

  const guess = Math.floor(Math.random() * alternatives.length);

  return alternatives[guess];
}
