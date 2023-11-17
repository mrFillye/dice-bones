import { action, computed, observable } from 'mobx'

export type User = {
  id: string
  state: 'idle' | 'lost' | 'win'
  name: string
  avatar: string
}

const model = {
  user: observable.box<User>(),
}

export const currentUser = {
  model,
  actions: {
    reset: action(() => {
      model.user.set(undefined)
    }),
    setUser: action((user: User) => {
      model.user.set(user)
    }),
  },
  computes: {
    userId: computed(() => {
      return model.user.get()?.id
    }),
  },
}
