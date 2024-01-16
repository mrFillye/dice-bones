import cx from 'classnames'
import { useEffect, useState } from 'react'

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
  const [userBalance, setUserBalance] = useState<number>(0)

  const user = stores.ui.currentUser.model.user.get()

  const part = participants.computes.participant(user?.id)

  useEffect(() => {
    setUserBalance(Number(user?.balance))
  }, [user?.balance])

  return (
    <div className={cx(styles.base, className)}>
      <div className={styles.icon} />
      <div
        className={styles.value}
        style={{ fontFamily: api.options.fontFamily?.additional }}
      >
        {Number(userBalance).toFixed(2)}
      </div>
    </div>
  )
}
