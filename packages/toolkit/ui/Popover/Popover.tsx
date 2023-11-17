import cx from 'classnames'
import { forwardRef } from 'react'

import styles from './Popover.module.scss'

const sides = {
  top: 'top',
  bottom: 'bottom',
  left: 'left',
  right: 'right',
} as const

export type PopoverProps = React.ComponentProps<'div'> & {
  side: (typeof sides)[keyof typeof sides]
}

type Component = React.ForwardRefExoticComponent<PopoverProps> & {
  sides: typeof sides
}

export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
  function Popover({ className, side, ...restProps }, ref) {
    return (
      <div
        {...restProps}
        className={cx(styles.base, styles[`base__${side}`], className)}
        ref={ref}
      />
    )
  },
) as Component

Popover.sides = sides
