import cx from 'classnames'
import React from 'react'

import styles from './Input.module.scss'
import { InputDecoration } from './InputDecoration'
import { InputField, InputFieldProps } from './InputField'
import { Theme, Type, themes, types } from './common'

export type InputProps = InputFieldProps & {
  fieldClassName?: string
  theme?: Theme
  type?: Type
}

type Component = React.ForwardRefExoticComponent<
  InputProps & React.RefAttributes<HTMLInputElement>
> & {
  themes: typeof themes
  types: typeof types
  Field: typeof InputField
  Decoration: typeof InputDecoration
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    fieldClassName,
    theme = themes.primary,
    type = 'text',
    ...restProps
  }: InputProps,
  ref,
) {
  return (
    <InputDecoration className={className} theme={theme}>
      <InputField
        {...restProps}
        className={fieldClassName}
        type={type}
        ref={ref}
      />
    </InputDecoration>
  )
}) as Component

Input.themes = themes
Input.types = types
Input.Field = InputField
Input.Decoration = InputDecoration

export { Input }
