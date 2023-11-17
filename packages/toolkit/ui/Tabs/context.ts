import { createContext, useContext } from 'react'

export const themes = {
  primary: 'primary',
} as const

export type Theme = (typeof themes)[keyof typeof themes]

export type Context = {
  theme: Theme
  active: string
  change: (id: string) => void
}

export const TabsContext = createContext<Context | null>(null)

export function useTabsContext() {
  const context = useContext(TabsContext)
  if (context === null) {
    throw new Error('You can use tabs hooks only with Tabs component')
  }
  return context
}
