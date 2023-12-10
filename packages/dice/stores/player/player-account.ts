import { action, computed, observable } from 'mobx'

export enum PLAYER_ACCOUNT_STATE {
  IDLE = 'idle',
  LOST = 'lost',
  WIN = 'win',
}

export type PlayerAccount = {
  id: number
  state?: `${PLAYER_ACCOUNT_STATE}`
  name?: string
  balance?: number
  hash?: string
  account_id?: number
}

type PlayerAccountState = {
  isLoadig?: boolean
  error?: {
    type?: 500 | 400
    message?: string
  }
}

const model = {
  playerAccount: observable.box<PlayerAccount>(),
  state: observable.box<PlayerAccountState>(),
}

export const playerAccountStore = {
  model,
  action: {
    resetUser: action(() => {
      model.playerAccount.set(undefined)
    }),
    setUser: action(async (user: PlayerAccount) => {
      await model.playerAccount.set(user)
    }),
    setIsLoading: action((isLoadig: boolean) => {
      model.state.set({ isLoadig })
    }),
    setError: action(({ error }: PlayerAccountState) => {
      model.state.set({ error })
    }),
    updateHash: action((user: PlayerAccount) => {
      model.playerAccount.set(user)
    }),
  },
  computes: {
    player: {
      playerData: computed(() => {
        return {
          id: model.playerAccount.get()?.id,
          balance: model.playerAccount.get()?.balance,
          name: model.playerAccount.get()?.name,
          state: model.playerAccount.get()?.state,
          hash: model.playerAccount.get()?.hash,
          account_id: model.playerAccount.get()?.account_id,
        }
      }),
      balance: computed(() => {
        return model.playerAccount.get()?.balance
      }),
      userId: computed(() => {
        return model.playerAccount.get()?.id
      }),
    },
    state: {
      isLoading: computed(() => {
        return model?.state.get()?.isLoadig
      }),
      error: computed(() => {
        return model?.state.get()?.error
      }),
    },
  },
}
