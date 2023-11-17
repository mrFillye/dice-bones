import { GameResult } from '@sok/game-common'

export type User = {
  id: string
  state: string
  name: string
  avatar: string
  bet: {
    currency: string
    value: number
  }
}

export namespace Contract {
  export type TState = 'idle' | 'lost' | 'win'

  export type TUser = {
    id: string
    state: TState
    name: string
    avatar: string
    socketIds: string[]
  }

  export type TUserCashOut = TUser & {
    cashOutTime: number
  }

  export type CurrentStateEvent =
    | {
        state: 'waiting'
        time: number
      }
    | {
        state: 'playing'
        time: number
      }

  export type PlayingState =
    | {
        state: 'win'
        won: number
      }
    | {
        state: 'idle' | 'lost'
      }

  export type TUserPlaying = PlayingState &
    (TUser & {
      readonly bet: {
        readonly currency: 'USD' | 'EUR'
        readonly value: number
        readonly autoCashOutFactor: number
      }
    })

  export type CrashOutEvent = TUserPlaying

  export type UpdateUsers = {
    users: TUserPlaying[]
  }

  export type FairnessResult = {
    hash: string
    result: GameResult
  }

  export type Snapshot = {
    playingUsers: Record<string, TUserPlaying>
    state: TState
    currentTime: number
    startTime: number
    history: FairnessResult[]
  }

  export type Crash = {
    state: TState
    currentTime: number
    startTime: number
  }

  export type BetEvent = {
    type: 'ok'
  }

  export type HistoryUpdate = {
    history: FairnessResult[]
  }
}
