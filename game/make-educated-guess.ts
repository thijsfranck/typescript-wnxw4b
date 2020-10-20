import DefaultMap from "mnemonist/default-map";
import { enumerate } from "../utils";

export interface Turn {
  readonly guess: string;
  readonly cows: number;
  readonly bulls: number;
}

export function makeEducatedGuess(
  turns: Iterable<Turn>,
  solutionSpace: Iterable<string>
) {
  const [bullsWeight, cowsWeight] = weighSymbols(turns);
  return makeGuess(bullsWeight, cowsWeight, solutionSpace);
}

function weighSymbols(turns: Iterable<Turn>) {
  const bullsWeight = new DefaultMap<string, DefaultMap<number, number>>(
    () => new DefaultMap(() => 0)
  );
  const cowsWeight = new DefaultMap<string, number>(() => 0);

  for (const { bulls, cows, guess } of turns) {
    for (const [key, index] of enumerate(guess)) {
      const bullsWeightMap = bullsWeight.get(key);
      bullsWeightMap.set(index, bullsWeightMap.get(index) + bulls);
      cowsWeight.set(key, cowsWeight.get(key) + cows);
    }
  }
  return [bullsWeight, cowsWeight] as const;
}

function makeGuess(
  bullsWeight: DefaultMap<string, DefaultMap<number, number>>,
  cowsWeight: DefaultMap<string, number>,
  solutionSpace: Iterable<string>
) {
  let alternatives = [],
    maxScore = null;
  for (const solution of solutionSpace) {
    let solutionScore = 0;

    for (const [key, index] of enumerate(solution)) {
      const bullsWeightMap = bullsWeight.get(key);
      solutionScore -= cowsWeight.get(key) + bullsWeightMap.get(index);
    }

    if (solutionScore === maxScore) alternatives.push(solution);

    if (maxScore === null || solutionScore > maxScore) {
      alternatives = [solution];
      maxScore = solutionScore;
    }
  }

  console.log(alternatives.length);
  const guess = Math.floor(Math.random() * alternatives.length);

  return alternatives[guess];
}
