import axios from 'axios'

const URL = 'http://localhost:3003/play-game'

export const instance = axios.create({
  baseURL: URL,
})
