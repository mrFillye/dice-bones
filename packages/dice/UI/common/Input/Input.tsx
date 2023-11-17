import { useMount } from '@sok/toolkit/hooks'
import cx from 'classnames'
import { autorun } from 'mobx'
import { ComponentProps, useState } from 'react'

import { useGameApi } from '../../../api'
import { form } from '../../../stores/ui/form'
import styles from './Input.module.scss'

export const types = {
  text: 'text',
  password: 'password',
  number: 'number',
  htmlNumber: 'htmlNumber',
  email: 'email',
  integer: 'integer',
} as const

export type Type = (typeof types)[keyof typeof types]

export type Props = ComponentProps<'input'>

export function Input({ className, onChange, type, ...restProps }: Props) {
  const [value, setValue] = useState('')
  const api = useGameApi()

  useMount(() => {
    autorun(() => {
      const betAmount = form.model.form.betAmount
      setValue((betText) =>
        betAmount !== Number(betText) ? betAmount.toFixed(2) : betText,
      )
    })
  })

  return (
    <input
      value={value}
      type="number"
      style={{ fontFamily: api.options.fontFamily?.additional }}
      {...restProps}
      onChange={(event) => {
        const newValue = event.currentTarget.value
        const result = form.actions.bet.update(Number(newValue))
        if (result !== Number(newValue)) {
          setValue(result.toFixed(2))
        } else {
          setValue(newValue)
        }
      }}
      className={cx(styles.base, className)}
    />
  )
}
