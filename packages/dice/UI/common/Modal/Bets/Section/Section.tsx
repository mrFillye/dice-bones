import cx from 'classnames'
import React from 'react'

import { useGameApi } from '../../../../../api'
import { IParticipant } from '../../../../../api/queries'
import styles from './Section.module.scss'

export type Props = {
  date: string
  bet: number
  win: number
  result: string
}

export default function Section({
  betValue,
  half,
  state,
  createdAt,
  wonAmount,
}: IParticipant) {
  const api = useGameApi()

  return (
    <div className={styles.base}>
      <span className={styles.dateAndTime}>{createdAt}</span>
      <span className={styles.bet}>
        <span className={styles.icon} />
        {betValue}
      </span>
      {api.options.adaptiveMode === 'desktop' && (
        <span className={styles.result}>{state}</span>
      )}
      <span className={cx(styles.bet, styles.bet__clear)}>
        <span className={styles.icon} /> {wonAmount}
      </span>
    </div>
  )
}
