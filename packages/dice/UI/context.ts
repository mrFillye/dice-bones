import { createContext, useContext } from 'react'

export type Half = 'first' | 'second'
export type Currency = 'USD' | 'EUR'

export type User = {
  id: string
  state: 'idle' | 'lost' | 'win'
  name: string
  avatar: string
}

export type BetRequest = {
  bet: {
    currency: Currency
    value: number
    half: Half
  }
} & User

export type CashoutRequest = {
  cashOutTime: number
} & User

export type BetHandler = (bet: BetRequest) => void

export type ModalId = 'info' | 'bets' | 'hidden'

export type UIContext = {
  modalId: ModalId
  onModalOpen: (value: ModalId) => void
  onBet: BetHandler | undefined
}

const UIContext = createContext<UIContext | null>(null)

export const UIProvider = UIContext.Provider
export const UIConsumer = UIContext.Consumer

export function useUIContext() {
  const context = useContext(UIContext)
  if (!context) {
    throw new Error('UIContext is not provided')
  }
  return context
}
