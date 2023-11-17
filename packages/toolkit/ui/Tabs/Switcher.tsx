import cx from 'classnames'
import React from 'react'

import styles from './Tabs.module.scss'
import { useTabsContext } from './context'

export type SwitcherProps = React.ComponentProps<'div'>

export const Switcher = React.forwardRef<HTMLDivElement, SwitcherProps>(
  function Switcher({ className, ...restProps }: SwitcherProps, ref) {
    const { theme } = useTabsContext()
    return (
      <div
        ref={ref}
        className={cx(styles.base, styles[`base__theme-${theme}`])}
        {...restProps}
      />
    )
  },
)
