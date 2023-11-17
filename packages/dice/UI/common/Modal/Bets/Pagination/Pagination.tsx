import cx from 'classnames'
import React from 'react'

import styles from './Pagination.module.scss'

export type Props = {
  current: number
  max: number
  onClick: React.Dispatch<React.SetStateAction<number>>
  className?: string
}

export default function Pagination({
  current,
  max,
  onClick,
  className,
}: Props) {
  return (
    <div className={cx(styles.base, className)}>
      <span
        className={cx(styles.icon, current === 1 && styles.icon__disabled)}
        onClick={() => {
          if (current === 1) {
            return
          }
          onClick((prev) => prev - 1)
        }}
      />
      <span className={styles.text}>{`${current} - ${max}`}</span>
      <span
        className={cx(
          styles.icon,
          styles.icon__right,
          max === current && styles.icon__disabled,
        )}
        onClick={() => {
          if (max === current) {
            return
          }
          onClick((prev) => prev + 1)
        }}
      />
    </div>
  )
}
