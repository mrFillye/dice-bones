'use client'

import cx from 'classnames'
import React from 'react'

import { Button } from '../Button/Button'
import styles from './Tabs.module.scss'
import { useTabsContext } from './context'

export type SwitchProps = {
  tabId: string
  children: React.ReactNode
  className?: string
}

export function Switch({ tabId, ...props }: SwitchProps) {
  const tabs = useTabsContext()
  const className = cx(styles.tabButton, props.className)

  if (tabs.active === tabId) {
    return <Button {...props} className={className} disabled theme="rock" />
  }
  return (
    <Button
      {...props}
      theme="empty"
      className={className}
      onClick={() => tabs.change(tabId)}
    />
  )
}
