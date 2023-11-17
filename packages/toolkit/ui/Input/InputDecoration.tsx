import cx from 'classnames'
import React from 'react'

import styles from './Input.module.scss'
import { GapColumns, Theme, gapColumnsSizes, themes } from './common'

export type InputProps = React.ComponentProps<'div'> & {
  theme?: Theme
  gapColumns?: GapColumns
}

type Component = React.ForwardRefExoticComponent<
  InputProps & React.RefAttributes<HTMLDivElement>
>

const InputDecoration = React.forwardRef<HTMLDivElement, InputProps>(
  function Input(
    {
      className,
      theme = themes.primary,
      gapColumns = gapColumnsSizes.medium,
      ...restProps
    }: InputProps,
    ref,
  ) {
    return (
      <div
        {...restProps}
        ref={ref}
        className={cx(
          styles.base,
          styles[`base__theme-${theme}`],
          styles[`base__gap-size-${gapColumns}`],
          className,
        )}
      />
    )
  },
) as Component

export { InputDecoration }
