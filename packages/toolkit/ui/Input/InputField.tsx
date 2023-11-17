import cx from 'classnames'
import React from 'react'

import { cleanInputInteger } from '../../helpers/cleanInputInteger'
import { cleanInputNumber } from '../../helpers/cleanInputNumber'
import styles from './Input.module.scss'
import { Type } from './common'

export type InputFieldProps = Omit<React.ComponentProps<'input'>, 'type'> & {
  type?: Type
}

type Component = React.ForwardRefExoticComponent<
  InputFieldProps & React.RefAttributes<HTMLInputElement>
>

const typeToHtmlType: Record<Type, string> = {
  text: 'text',
  password: 'password',
  number: 'text',
  email: 'email',
  htmlNumber: 'number',
  integer: 'text',
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  function Input(
    { className, type = 'text', ...restProps }: InputFieldProps,
    ref,
  ) {
    const handleChange = (() => {
      if (type === 'number') {
        return function handleChangeNumber(
          event: React.ChangeEvent<HTMLInputElement>,
        ) {
          const { value } = event.target
          event.target.value = cleanInputNumber(value)
          restProps.onChange?.(event)
        }
      }

      if (type === 'integer') {
        return function handleChangeInteger(
          event: React.ChangeEvent<HTMLInputElement>,
        ) {
          const { value } = event.target
          event.target.value = cleanInputInteger(value)
          restProps.onChange?.(event)
        }
      }

      return restProps.onChange
    })()

    return (
      <input
        {...restProps}
        ref={ref}
        type={typeToHtmlType[type] ?? type}
        className={cx(styles.empty, className)}
        onChange={handleChange}
      />
    )
  },
) as Component

export { InputField }
