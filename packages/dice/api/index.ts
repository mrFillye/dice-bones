import axios from 'axios'

const URL = 'http://185.149.146.191/dice-game'

export const instance = axios.create({
  baseURL: URL,
})
