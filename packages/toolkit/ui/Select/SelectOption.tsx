'use client'

import cx from 'classnames'
import React from 'react'

import { ButtonProps } from '../Button/Button'
import styles from './Select.module.scss'
import { useSelectContext } from './context'

export type SelectOptionProps = Omit<ButtonProps, 'theme' | 'ref'> & {
  value: string
}

type Component = React.ForwardRefExoticComponent<SelectOptionProps> & {
  __TYPE__: 'SelectOption'
}

export const SelectOption = React.forwardRef<
  HTMLButtonElement,
  SelectOptionProps
>(function Option({ className, onClick, value, ...restProps }, ref) {
  const { change, active } = useSelectContext()

  React.useEffect(() => {
    if (active.value === value && active.display !== restProps.children) {
      change({ value, display: restProps.children })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active.value])

  return (
    <button
      {...restProps}
      onClick={(event) => {
        change({ value, display: restProps.children })
        onClick?.(event)
      }}
      className={cx(
        styles.option,
        active.value === value && styles.option__active,
        className,
      )}
      ref={ref}
    />
  )
}) as Component

SelectOption.__TYPE__ = 'SelectOption'
