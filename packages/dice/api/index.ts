import axios from 'axios'

const PROD_URL = 'https://bur.bet/dice-game'

const DEV_URL = 'http://localhost:3004/dice-game'

const isLocal = window.location.href.includes('localhost')

const URL = !isLocal ? DEV_URL : PROD_URL

export const instance = axios.create({
  baseURL: URL,
})
