import { GameState } from '@sok/game-common';

export type GameStepArgs = {
  state: GameState;
  onEnd?: () => void;
  onTick?: (duration: number) => void;
  syncTime: number;
  gameStepTime: number;
};
