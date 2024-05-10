import { action, computed, observable } from 'mobx'

export type Settings = {
  sound: boolean
  music: boolean
}
const model = {
  settings: observable.box<Settings>(),
}

export const settings = {
  model,
  actions: {
    updateSettings: action((settings: Settings) => {
      model.settings.set(settings)
    }),
  },
  computes: {
    getMusic: computed(() => {
      return model.settings.get()?.music
    }),
    getSound: computed(() => {
      return model.settings.get()?.sound
    }),
  },
}
