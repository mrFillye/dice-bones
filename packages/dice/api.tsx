import { createContext, useContext, useMemo } from 'react'

import { fsm } from './stores/fsm'
import { shaking } from './stores/shaking'
import { settings } from './stores/ui/settings'
import { waiting } from './stores/waiting'

export type AdaptiveMode = 'mobile' | 'desktop'

export type Options = {
  fontFamily?: {
    main: string
    additional: string
  }
  adaptiveMode: AdaptiveMode
}

export type GameAPIState = {
  options: Options
}

const context = createContext<GameAPIState | null>(null)

export const GameAPIContext = context

export type Props = React.PropsWithChildren<Options>

export function GameApiProvider(props: any) {
  const value = useMemo(
    (): GameAPIState => ({
      options: {
        fontFamily: props.fontFamily,
        adaptiveMode: props.adaptiveMode ?? 'desktop',
      },
    }),
    [props.fontFamily, props.adaptiveMode],
  )
  return <context.Provider value={value}>{props.children}</context.Provider>
}

export function useGameApi() {
  const value = useContext(context)
  if (!value) {
    throw new Error('GameApiProvider is missing')
  }
  return value
}

export const shakeStores = {
  shaking: shaking,
  waiting: waiting,
  fsm: fsm,
  settings: settings,
}
