export const states = {
  waiting: 'waiting',
  playing: 'playing',
} as const

export type GameState = ValueOf<typeof states>
