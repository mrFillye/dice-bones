import cx from 'classnames'

import { useGameApi } from '../../api'
import { stores } from '../../stores'
import { currentUser } from '../../stores/ui/current-user'
import { participants } from '../../stores/ui/participants'
import styles from './Balance.module.scss'

export type Props = {
  className?: string
}

export default function Balance({ className }: Props) {
  const api = useGameApi()

  return (
    <div className={cx(styles.base, className)}>
      <div className={styles.icon} />
      <div
        className={styles.value}
        style={{ fontFamily: api.options.fontFamily?.additional }}
      >
        {Number(5924).toFixed(2)}
      </div>
    </div>
  )
}
