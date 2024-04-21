import { logger } from '@sok/toolkit/helpers/logger'
import cx from 'classnames'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'

import { fsm } from '../../stores/fsm'
import { currentUser } from '../../stores/ui/current-user'
import { form } from '../../stores/ui/form'
import Button from '../common/Button/Button'
import { Input } from '../common/Input/Input'
import { Half, useUIContext } from '../context'
import styles from './ControlPanel.module.scss'

export type Props = {
  className?: string
}

export const ControlPanel = observer(function ControlPanel({
  className,
}: Props) {
  const [currentBet, setCurrentBet] = useState<Half>()
  const [isSubmited, setIsSubmitted] = useState<boolean>(false)

  const { betAmount } = form.model.form
  const uiContext = useUIContext()
  const user = currentUser.model.user.get()
  const currentState = fsm.model.value.get()
  const { updateBalance } = currentUser.actions

  const handleBet = (bet: Half) => {
    setCurrentBet(bet)
  }

  const handlePlaceBet = () => {
    if (!user || !currentBet || betAmount === 0) {
      return logger.warn('PlaceBetButton: something is not defined')
    }

    if (Number(user?.balance) === 0) {
      return logger.warn('Values: 0')
    }

    if (Number(user?.balance) < betAmount) {
      return logger.warn('Very expensive for you')
    }

    uiContext.onBet?.({
      ...user,
      bet: {
        currency: 'USD',
        value: betAmount,
        half: currentBet,
      },
    })

    if (user?.balance) {
      const minusBalance = Number(user.balance) - betAmount
      updateBalance(String(minusBalance))
    }

    setIsSubmitted(true)
    setCurrentBet(undefined)
  }

  useEffect(() => {
    if (currentState === 'end') {
      setCurrentBet(undefined)
      setIsSubmitted(false)
    }
  }, [currentState])

  //TO_DO
  // const isPlayingProcess = currentState !== 'wait'

  return (
    <div className={cx(styles.base, className)}>
      <Input
        className={styles.input}
        type="number"
        min={0}
        placeholder="5000.00"
      />
      <div className={styles.wrapper}>
        <Button
          disabled={isSubmited}
          className={cx(
            styles.minBetButton,
            styles.betButton,
            currentBet === 'first' && styles.minBetButton__disabled,
          )}
          onClick={() => handleBet('first')}
        >
          <div className={cx(styles.betText, styles.betText__left)}>
            <div>1-6</div>{' '}
            <div className={cx(styles.betText__small)}>x2.00</div>
          </div>
        </Button>
        <Button
          disabled={isSubmited}
          className={cx(
            styles.maxBetButton,
            styles.betButton,
            currentBet === 'second' && styles.maxBetButton__disabled,
          )}
          onClick={() => handleBet('second')}
        >
          <div className={cx(styles.betText, styles.betText__right)}>
            <div>7-12</div>{' '}
            <div className={cx(styles.betText__right, styles.betText__small)}>
              x2.00
            </div>
          </div>
        </Button>
      </div>
      <Button
        disabled={!Boolean(currentBet)}
        className={styles.playButton}
        onClick={() => handlePlaceBet()}
      >
        <div className={styles.text}>PLAY</div>
      </Button>
    </div>
  )
})
