import cx from 'classnames'
import React from 'react'

import { useGameApi } from '../../../api'
import { Participant } from '../../../stores/ui/participants'
import styles from './Row.module.scss'

export type Props = {
  participant: Participant
}

const betLabel = {
  ['first']: '1-6',
  ['second']: '7-12',
}

export default function Row({ participant }: Props) {
  const api = useGameApi()

  return (
    <div
      className={styles.base}
      style={{ fontFamily: api.options.fontFamily?.additional }}
    >
      <div className={cx(styles.name, styles.text)}>
        {participant.name.toUpperCase()}
      </div>
      <div className={styles.text}>BETS</div>
      <div className={cx(styles.value, styles.badge)}>
        {Number(participant.bet.value).toFixed(2)}
      </div>
      <div className={styles.text}>ON</div>
      <div className={styles.badge}>{betLabel[participant.bet.half]}</div>
    </div>
  )
}
