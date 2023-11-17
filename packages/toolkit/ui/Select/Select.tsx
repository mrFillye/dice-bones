'use client'

import cx from 'classnames'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { useEvent } from '../../hooks'
import styles from './Select.module.scss'
import { SelectButton } from './SelectButton'
import { SelectOption } from './SelectOption'
import { SelectOptions } from './SelectOptions'
import { ProviderProps, themes } from './common'
import { Active, Context, SelectContext, useSelectContext } from './context'

export { useSelectContext }

export type SelectProps = React.ComponentProps<'div'> & ProviderProps

function Provider(props: React.PropsWithChildren<ProviderProps>) {
  const {
    theme = 'primary',
    children,
    onActiveChange: onActiveChangeProps,
    onOpen,
    onClose,
    disabled = false,
  } = props

  const [active, setActiveRaw] = useState<Active>({
    value: props.active,
    display: null,
  })

  const [opened, setOpened] = useState(props.opened ?? false)

  const onActiveChange = useEvent((newActive: string | undefined) => {
    if (newActive !== active.value) {
      onActiveChangeProps?.(newActive)
    }
  })
  const setActive = useCallback(
    (active: Active) => {
      setActiveRaw(active)
      onActiveChange?.(active.value)
    },
    [onActiveChange],
  )

  const value = useMemo(
    (): Context => ({
      active,
      change: setActive,
      theme,
      setOpened,
      opened,
      disabled,
    }),
    [active, disabled, opened, setActive, theme],
  )

  useEffect(() => {
    setOpened(props.opened ?? false)
  }, [props.opened])

  useEffect(() => {
    if (opened) {
      onOpen?.()
    } else {
      onClose?.()
    }
  }, [onClose, onOpen, opened])

  useEffect(() => {
    if (props.active && active.value !== props.active) {
      setActiveRaw({
        value: props.active,
        display: null,
      })
    }
  }, [active, props.active])

  return (
    <SelectContext.Provider value={value}>{children}</SelectContext.Provider>
  )
}

type Component = React.ForwardRefExoticComponent<SelectProps> & {
  themes: typeof themes
  Button: typeof SelectButton
  Options: typeof SelectOptions
  Option: typeof SelectOption
}

const Select = React.forwardRef<HTMLDivElement, ProviderProps>(function Select(
  {
    className,
    theme = themes.primary,
    opened,
    active,
    onActiveChange: onChange,
    onOpen,
    disabled,
    onClose,
    ...restProps
  }: SelectProps,
  ref,
) {
  return (
    <Provider
      opened={opened}
      active={active}
      theme={theme}
      disabled={disabled}
      onActiveChange={onChange}
      onOpen={onOpen}
      onClose={onClose}
    >
      <div className={cx(styles.base, className)} {...restProps} ref={ref} />
    </Provider>
  )
}) as Component

Select.themes = themes
Select.Button = SelectButton
Select.Options = SelectOptions
Select.Option = SelectOption

export { Select }
