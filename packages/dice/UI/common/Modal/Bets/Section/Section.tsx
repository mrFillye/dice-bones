import cx from 'classnames'
import React from 'react'

import { useGameApi } from '../../../../../api'
import styles from './Section.module.scss'

export type Props = {
  date: string
  bet: number
  win: number
  result: string
}

export default function Section({ date, bet, result, win }: Props) {
  const api = useGameApi()

  return (
    <div className={styles.base}>
      <span className={styles.dateAndTime}>{date}</span>
      <span className={styles.bet}>
        <span className={styles.icon} />
        {bet}
      </span>
      {api.options.adaptiveMode === 'desktop' && (
        <span className={styles.result}>{result}</span>
      )}
      <span className={cx(styles.bet, styles.bet__clear)}>
        <span className={styles.icon} />
        {win}
      </span>
    </div>
  )
}
