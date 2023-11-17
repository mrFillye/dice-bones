import { Bet } from './bet'

export type UserDto = {
  id: string
  name: string
  avatar: string
}

export type GameUser = UserDto & {
  type: 'user'
  socketIds: string[]
}

export type PlayingUser = Omit<GameUser, 'type'> & {
  type: 'participant'
  bet: Bet
} & PlayerBetResult

export type PlayerBetResult =
  | {
      state: 'win'
      wonAmount: number
    }
  | {
      state: 'idle' | 'lost'
    }

export type PlayingUserDto = UserDto & {
  bet: Bet
}
