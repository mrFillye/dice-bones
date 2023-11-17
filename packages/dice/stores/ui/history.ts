import { FairnessResult, GameResult } from '@sok/game-common'
import { action, observable } from 'mobx'

import { Contract } from '../../types'

const histories = Array.from({ length: 5 }, (_, i) => ({
  result: [3, 4] as GameResult,
  hash: 'DEMO',
}))

const model = {
  history: observable.box<FairnessResult[]>(histories),
}

export const history = {
  model,
  actions: {
    reset: action(() => {
      model.history.set([])
    }),
    put: action((history: FairnessResult[]) => {
      model.history.set(history)
    }),
  },
  computes: {},
}
