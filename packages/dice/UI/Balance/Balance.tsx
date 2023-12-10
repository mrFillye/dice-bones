import cx from 'classnames'

import { shakeStores, useGameApi } from '../../api'
import { stores } from '../../stores'
import { currentUser } from '../../stores/ui/current-user'
import { participants } from '../../stores/ui/participants'
import styles from './Balance.module.scss'

export type Props = {
  className?: string
}

export default function Balance({ className }: Props) {
  const api = useGameApi()

  const { player } = shakeStores

  const { balance } = player.computes.player.playerData.get()

  return (
    <div className={cx(styles.base, className)}>
      <div className={styles.icon} />
      <div
        className={styles.value}
        style={{ fontFamily: api.options.fontFamily?.additional }}
      >
        {balance && Number(balance).toFixed(2)}
      </div>
    </div>
  )
}
