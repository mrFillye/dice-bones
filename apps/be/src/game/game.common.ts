import { Bet, FairnessResult, GameResult } from '@sok/game-common';
import { Half } from '@sok/game-common';

export type DiceResult = Half | 'no-one';

export function calculateWonAmount(bet: Bet) {
  const { value, half } = bet;
  switch (half) {
    case 'first':
      return value * 2;
    case 'second':
      return value * 2;
    default:
      console.warn('Unknown property');
      return 0;
  }
}

export function determineDiceResult(game: FairnessResult): DiceResult {
  const { result } = game;
  const sum = result[0] + result[1];
  if (isEdge(result)) {
    return 'no-one';
  }
  if (sum > 6) {
    return 'second';
  }
  return 'first';
}

export function isEdge(result: GameResult) {
  return result[0] * result[1] === 0;
}
