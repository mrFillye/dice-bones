import cx from 'classnames'
import React from 'react'

import styles from './Button.module.scss'

const themes = {
  primary: 'primary',
  secondary: 'secondary',
  embossing: 'embossing',
  simple: 'simple',
  empty: 'empty',
  rock: 'rock',
} as const

export type ButtonProps = React.ComponentProps<'button'> & {
  theme?: (typeof themes)[keyof typeof themes]
}

type Component = React.ForwardRefExoticComponent<ButtonProps> & {
  themes: typeof themes
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, theme = themes.primary, ...restProps }: ButtonProps,
  ref,
) {
  return (
    <button
      ref={ref}
      className={cx(styles.base, styles[`base__theme-${theme}`], className)}
      {...restProps}
    />
  )
}) as Component

Button.themes = themes

export { Button }
