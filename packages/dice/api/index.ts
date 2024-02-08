import axios from 'axios'

const URL = 'https://bur.bet/dice-game'

export const instance = axios.create({
  baseURL: URL,
})
