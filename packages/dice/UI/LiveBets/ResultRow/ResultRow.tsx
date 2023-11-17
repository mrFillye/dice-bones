import cx from 'classnames'
import React from 'react'

import { useGameApi } from '../../../api'
import { Participant } from '../../../stores/ui/participants'
import styles from './ResultRow.module.scss'

export type Props = {
  participant: Participant
}

const betLabel = {
  ['first']: '1-6',
  ['second']: '7-12',
}

export default function ResultRow({ participant }: Props) {
  const api = useGameApi()

  return (
    <div
      className={styles.base}
      style={{ fontFamily: api.options.fontFamily?.additional }}
    >
      <div className={cx(styles.name, styles.text)}>
        {participant.name.toUpperCase()}
      </div>
      <div className={styles.text}>WON</div>
      <div className={cx(styles.value, styles.badge)}>
        {participant.wonAmount}
      </div>
    </div>
  )
}
