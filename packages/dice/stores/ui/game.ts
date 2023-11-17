import { GameResult } from '@sok/game-common'
import { action, computed, observable } from 'mobx'

export type Game = {
  result?: GameResult
}

const model = {
  game: observable.box<Game>(),
}

export const gameStore = {
  model,
  actions: {
    setGame: action((game?: Game) => {
      model.game.set(game)
    }),
  },
}
