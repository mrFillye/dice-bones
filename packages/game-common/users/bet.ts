export type Currency = 'USD' | 'EUR'

export type Half = 'first' | 'second'

export type Bet = {
  currency: Currency
  value: number
  half: Half
}
