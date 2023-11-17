import { action, observable } from 'mobx'

const shakingModel = observable({
  time: 0,
  runTime: 0,
})

export const shaking = {
  model: shakingModel,
  actions: {
    updateTime: action((time: number) => {
      shakingModel.time = time
    }),
    updateRunTime: action((time: number) => {
      shakingModel.runTime = time
    }),
  },
}
