import axios from 'axios'

// const URL = 'http://localhost:3004/dice-game'
const URL = 'https://bur.bet/dice-game'

export const instance = axios.create({
  baseURL: URL,
})
