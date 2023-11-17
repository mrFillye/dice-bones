import { action, observable } from 'mobx'

const model = observable({
  remainingTime: 0,
})

export const waiting = {
  model,
  actions: {
    updateRemainingTime: action((time: number) => {
      model.remainingTime = Math.max(0, time)
    }),
  },
}
