import { instance } from '../api/'
import {
  PlayerAccount,
  playerAccountStore,
} from '../stores/player/player-account'

const { setError } = playerAccountStore.action

type CheckPoint = {
  id: string
  hash: string
}

export const initGame = async ({ id, balance, name }: PlayerAccount) => {
  try {
    const res = await instance.get(
      `/init?operator_id=4009&user_id=${id}&auth_token=xyztest&balance=${balance}&name=${name}`,
    )

    return res?.data
  } catch (error) {
    console.log(error)
    setError({ error: { type: 500, message: error as string } })
  }
}

//next_hash
export const playGame = async ({ id, hash }: CheckPoint) => {
  try {
    const res = await instance.post(
      `play-game/play?user_id=${id}&current_hash=${hash}`,
    )

    return res?.data
  } catch (error) {
    console.log(error)
    setError({ error: { type: 500, message: error as string } })
  }
}

export const checkPoint = async ({ id, hash }: CheckPoint) => {
  try {
    const res = await instance.post(`play-game/play?user_id=${id}&hash=${hash}`)

    return res?.data
  } catch (error) {
    setError({ error: { type: 500, message: error as string } })
  }
}

//+ Пагинация
export const getHistory = async () => {
  try {
    const res = await instance.get(`play-game/history`)

    return res?.data
  } catch (error) {
    setError({ error: { type: 500, message: error as string } })
  }
}

export const getAccounts = async () => {
  try {
    const res = await instance.get(`play-game/accounts`)

    return res?.data
  } catch (error) {
    setError({ error: { type: 500, message: error as string } })
  }
}

export const getResult = async (userId: string, hash: string) => {
  try {
    const res = await instance.get(
      `play-game/result?user_id=${userId}&hash=${hash}`,
    )

    return res?.data
  } catch (error) {
    setError({ error: { type: 500, message: error as string } })
  }
}
