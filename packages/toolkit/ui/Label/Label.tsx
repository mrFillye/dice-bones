import cx from 'classnames'
import { forwardRef } from 'react'

import styles from './Label.module.scss'

export type LabelProps = React.ComponentProps<'label'>

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, ...restProps },
  ref,
) {
  return (
    <label {...restProps} className={cx(styles.base, className)} ref={ref} />
  )
})
