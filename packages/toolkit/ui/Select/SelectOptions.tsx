'use client'

import cx from 'classnames'
import React from 'react'

import styles from './Select.module.scss'
import { useSelectContext } from './context'

export type SelectOptionsProps = React.ComponentProps<'div'>

export const SelectOptions = React.forwardRef<
  HTMLDivElement,
  SelectOptionsProps
>(function SelectOptions({ className, children, ...restProps }, ref) {
  const { theme, opened } = useSelectContext()

  return (
    <div
      ref={ref}
      className={cx(
        styles.options,
        styles[`options__theme-${theme}`],
        opened ? styles.options__opened : styles.options__closed,
      )}
      {...restProps}
    >
      {children}
    </div>
  )
})
