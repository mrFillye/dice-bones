import cx from 'classnames'
import { observer } from 'mobx-react-lite'
import { useMemo, useState } from 'react'

import { fsm } from '../stores/fsm'
import Balance from './Balance/Balance'
import { ControlPanel } from './ControlPanel/ControlPanel'
import Info from './Info/Info'
import { LiveBets } from './LiveBets/LiveBets'
import Settings from './Settings/Settings'
import styles from './UI.module.scss'
import Modal from './common/Modal/Modal'
import { ModalId, UIContext, UIProvider } from './context'

export type UIProps = {
  className?: string
  onBet?: UIContext['onBet']
}

export const UI = observer(function UI(props: UIProps) {
  const [modalId, setModalId] = useState<ModalId>('hidden')
  const currentState = fsm.model.value.get()

  const loaded = currentState !== 'loading'
  const liveBetsVisible = currentState === 'wait' || currentState === 'result'

  const handleModalOpen = (value: ModalId) => {
    setModalId(value)
  }

  const contextValue = useMemo(
    (): UIContext => ({
      modalId: modalId,
      onBet: props.onBet,
      onModalOpen: handleModalOpen,
    }),
    [props.onBet, modalId],
  )
  return (
    <UIProvider value={contextValue}>
      <div className={cx(styles.base, props.className)}>
        <LiveBets
          className={cx(
            styles.liveBets,
            !liveBetsVisible && styles.liveBets__visible,
          )}
        />
        {loaded && (
          <>
            <ControlPanel
              className={cx(
                styles.controlPanel,
                currentState !== 'wait' && styles.controlPanel__disabled,
              )}
            />
            <Settings className={styles.settings} />
            <Balance className={styles.balance} />
            <Info className={styles.info} />
            <Modal />
          </>
        )}
        <div className={cx(styles.table, !loaded && styles.table__empty)} />
      </div>
    </UIProvider>
  )
})
