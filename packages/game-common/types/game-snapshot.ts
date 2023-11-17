import { FairnessResult } from '../fairness'
import { PlayingUser } from '../users'
import { GameGenericState } from './common'

export type GameSnapshot = GameGenericState & {
  startTime: number
  currentTime: number
  history: FairnessResult[]
  time: number
}

export type Snapshot = GameSnapshot & {
  participants: PlayingUser[]
}
