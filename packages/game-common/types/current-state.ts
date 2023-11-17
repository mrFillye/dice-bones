import { GameGenericState } from './common'

export type CurrentState = GameGenericState & {
  time: number
}
