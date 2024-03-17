import axios from 'axios'

const URL = 'https://bur.bet/dice-game'
// const URL = 'http://localhost:3004/dice-game'

export const instance = axios.create({
  baseURL: URL,
})
