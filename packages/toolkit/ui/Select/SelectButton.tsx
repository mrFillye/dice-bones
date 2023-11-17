'use client'

import cx from 'classnames'
import React, { useEffect } from 'react'

import { Arrow } from './Arrow'
import styles from './Select.module.scss'
import { ProviderProps } from './common'
import { useSelectContext } from './context'

export type SelectButtonProps = React.ComponentProps<'button'> &
  ProviderProps & {
    withArrow?: boolean
  }

export const SelectButton = React.forwardRef<
  HTMLButtonElement,
  Omit<SelectButtonProps, keyof ProviderProps>
>(function SelectButton(
  { className, children, withArrow = true, ...restProps },
  ref,
) {
  const { theme, opened, setOpened, active, disabled } = useSelectContext()

  useEffect(() => {
    if (opened) {
      const handler = () => setOpened(false)
      document.addEventListener('click', handler)
      return () => document.removeEventListener('click', handler)
    }
  }, [opened, setOpened])

  return (
    <button
      disabled={disabled}
      ref={ref}
      className={cx(
        styles.button,
        styles[`button__theme-${theme}`],
        opened ? styles.button__opened : styles.button__closed,
        className,
      )}
      onClick={opened ? undefined : () => setOpened(true)}
      {...restProps}
    >
      {active.value ? active.display : children}
      {withArrow && <Arrow className={styles.icon} />}
    </button>
  )
})
