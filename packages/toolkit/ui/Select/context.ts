import { createContext, useContext } from 'react'

import { Theme } from './common'

export type Active = {
  value: string | undefined
  display: React.ReactNode
}

export type Context = {
  theme: Theme
  disabled: boolean
  active: Active
  opened: boolean
  setOpened: (opened: boolean | ((opened: boolean) => boolean)) => void
  change: (active: Active) => void
}

export const SelectContext = createContext<Context | null>(null)

export function useSelectContext() {
  const context = useContext(SelectContext)
  if (context === null) {
    throw new Error('You can use tabs hooks only with Tabs component')
  }
  return context
}
