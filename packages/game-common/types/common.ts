import { FairnessResult, GameResult } from '../fairness'
import { PlayingUser } from '../users'
import { GameState } from './game-states'

export type GameGenericState = {
  state: GameState
  result?: FairnessResult
  results?: PlayingUser[]
}
