'use client'

import React, { useEffect, useMemo, useState } from 'react'

import { useEvent } from '../../hooks'
import { Content } from './Content'
import { Switch } from './Switch'
import { Switcher } from './Switcher'
import { Context, TabsContext, themes } from './context'

export type TabsProps = React.PropsWithChildren<{
  theme?: (typeof themes)[keyof typeof themes]
  active: string
  onActiveChange?: (active: string) => void
}>

function Tabs(props: TabsProps) {
  const {
    theme = 'primary',
    active: activeProps,
    children,
    onActiveChange,
  } = props

  const [active, setActiveId] = useState(activeProps)

  const handleActiveChange = useEvent((active: string) => {
    onActiveChange?.(active)
  })

  const value = useMemo(
    (): Context => ({ active, change: setActiveId, theme }),
    [active, theme],
  )

  useEffect(() => {
    setActiveId(activeProps)
  }, [activeProps])

  useEffect(() => {
    if (activeProps !== active && onActiveChange) {
      handleActiveChange(activeProps)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, handleActiveChange])

  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>
}

Tabs.themes = themes
Tabs.Switcher = Switcher
Tabs.Switch = Switch
Tabs.Content = Content

export { Tabs }
