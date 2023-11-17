import { clamp } from '@sok/toolkit/helpers/clamp'
import { action, computed, observable } from 'mobx'

const model = observable({
  form: {
    betAmount: 0,
  },
  config: {
    maxBet: 5000,
    minBet: 0.25,
    maxAutoCashout: 999,
    minAutoCashout: 1.05,
    upDownStep: 0.25,
  },
})

const updateBet = action((newValue: number) => {
  if (Number.isNaN(newValue) || newValue < model.config.minBet) {
    model.form.betAmount = 0
    return 0
  }
  model.form.betAmount = clamp(
    newValue,
    model.config.minBet,
    model.config.maxBet,
  )
  return model.form.betAmount
})

export const form = {
  model,
  actions: {
    bet: {
      update: updateBet,
      half: action(() => {
        updateBet(model.form.betAmount / 2)
      }),
      double: action(() => {
        updateBet(model.form.betAmount * 2)
      }),
      clear: action(() => {
        updateBet(0)
      }),
    },
  },
  computes: {
    betAmount: computed(() => {
      const { betAmount } = model.form
      return betAmount ? betAmount.toFixed(2) : ''
    }),
  },
}
