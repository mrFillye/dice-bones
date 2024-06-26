import cx from 'classnames'
import { useEffect, useRef, useState } from 'react'

import { useGameApi } from '../../api'
import { stores } from '../../stores'
import styles from './Balance.module.scss'

export type Props = {
  className?: string
}

function animateValue(
  currentBalance: any,
  start: number,
  end: number,
  duration: number,
) {
  let startTimestamp: number | null = null
  const step = (timestamp: number) => {
    if (!startTimestamp) startTimestamp = timestamp
    const progress = Math.min((timestamp - startTimestamp) / duration, 1)
    currentBalance.innerHTML = (progress * (end - start) + start).toFixed(2)
    if (progress < 1) {
      window.requestAnimationFrame(step)
    }
  }
  window.requestAnimationFrame(step)
}

export default function Balance({ className }: Props) {
  const api = useGameApi()
  const [userBalance, setUserBalance] = useState<number>(0)
  const balanceRef = useRef<HTMLDivElement>(null)

  const user = stores.ui.currentUser.model.user.get()

  useEffect(() => {
    animateValue(balanceRef.current, userBalance, Number(user?.balance), 1000)
    setUserBalance(Number(user?.balance))
  }, [user?.balance])

  return (
    <div className={cx(styles.base, className)}>
      <div className={styles.icon} />
      <div
        ref={balanceRef}
        className={styles.value}
        style={{ fontFamily: api.options.fontFamily?.additional }}
      ></div>
    </div>
  )
}
