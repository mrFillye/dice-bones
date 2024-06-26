import DiceGame, { UI, stores } from '@sok/dice'
import { shakeStores } from '@sok/dice/api'
import {
  CurrentState,
  FairnessResult,
  PlayingUser,
  Snapshot,
  socketEvents,
} from '@sok/game-common'
import { logger } from '@sok/toolkit/helpers/logger'
import cx from 'classnames'
import { autorun } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AudioPlayer } from '~/components/AudioPlayer'

import { useSocket } from '../SocketProvider'
import styles from './GameFrame.module.scss'
import { Contract } from './types'

const CANVAS_OPTIONS = {
  width: 1100,
  height: 567,
  resolution: 1.5,
}

const PROD_URL = 'wss://bur.bet/game'

const DEV_URL = 'ws://localhost:3004/game'

const isLocal = window.location.href.includes('localhost')

const URL = isLocal ? DEV_URL : PROD_URL
export const GameFrame = observer(function GameFrame() {
  const { socket, instantiate } = useSocket()

  const searchParams = useSearchParams()

  const { push } = useRouter()

  const { get } = searchParams

  const { setUser, reset, updateBalance } = stores.ui.currentUser.actions

  const { updateCurrentTimerValue } = stores.waiting.actions

  const id = get('id')
  const name = get('name')
  const balance = get('balance')

  useEffect(() => {
    if (socket) return
    instantiate(URL, '')
  }, [])

  useEffect(() => {
    setUser({
      id: String(id),
      name: String(name),
      state: 'idle',
      balance: String(balance),
      avatar: '',
    })

    return () => {
      reset()
    }
  }, [id, name, balance])

  const currentUser = stores.ui.currentUser.model.user.get()

  const currentState = shakeStores.fsm.model.value.get()

  const [currentBalance, setCurrentBalance] = useState<number>(
    Number(currentUser?.balance) || 0,
  )

  useEffect(() => {
    if (currentState !== 'result') return

    if (currentBalance === 0) return

    updateBalance(String(currentBalance))
  }, [currentState])

  useEffect(() => {
    if (!currentUser?.balance) return

    const params = new URLSearchParams(searchParams)

    params.set('balance', Number(currentUser?.balance).toFixed(2))

    push(`?${params.toString()}`)
  }, [currentUser?.balance])

  useEffect(() => {
    if (!socket) return

    socket?.emit(socketEvents.snapshot.snapshot, currentUser)
  }, [socket])

  useEffect(() => {
    if (!socket) {
      return
    }

    socket.on('connect', () => {
      logger.info('Connected')
    })

    socket.on('disconnect', () => {
      logger.info('Disconnected')
    })

    socket.on(socketEvents.state.current, (event: CurrentState) => {
      switch (event.state) {
        case 'waiting':
          return shakeStores.fsm.actions.send({
            type: 'WAIT',
            time: event.time,
          })
        case 'playing':
          stores.ui.gameStore.actions.setGame(event.result)
          if (event.results) {
            const user = event.results.find((user) => {
              if (user) {
                return user.id === id
              }

              return {}
            })

            // @ts-ignore
            if (user?.balance) {
              // @ts-ignore
              setCurrentBalance(user?.balance)
            }
            if (user) {
              stores.ui.participants.actions.put(Object.values(event.results))
            }
          }

          return shakeStores.fsm.actions.send({
            type: 'SHAKE',
            time: 12000 - event.time,
          })
      }
    })

    socket.on(socketEvents.users.bet, (data: Contract.BetEvent) => {
      logger.debug(socketEvents.users.bet, JSON.stringify(data, null, 2))
    })

    socket.on(
      socketEvents.snapshot.snapshot,
      (snapshot: Snapshot & { time: number }) => {
        switch (snapshot.state) {
          case 'waiting':
            updateCurrentTimerValue(snapshot.time)
            return shakeStores.fsm.actions.send({
              type: 'WAIT',
              time: snapshot.time,
            })

          case 'playing':
            // updateTime(snapshot.time)
            stores.ui.gameStore.actions.setGame(snapshot.result)

            if (snapshot.results) {
              stores.ui.participants.actions.put(
                Object.values(snapshot.results),
              )
            }

            logger.debug(
              socketEvents.snapshot.snapshot,
              JSON.stringify(snapshot, null, 2),
            )
            stores.ui.participants.actions.put(
              Object.values(snapshot.participants),
            )
            stores.ui.history.actions.put(snapshot.history)

            return shakeStores.fsm.actions.send({
              type: 'SHAKE',
              time: 12000 - snapshot.time,
            })
        }
      },
    )

    socket.on(
      socketEvents.users.update,
      (
        data: PlayingUser[] & { id: string; action: string; balance: string }[],
      ) => {
        const user = data.find(({ id }) => id === currentUser?.id)

        //@ts-ignore
        if (user.action === 'cancel') {
          //@ts-ignore
          updateBalance(user.balance)
        }

        logger.debug(socketEvents.users.update, JSON.stringify(data, null, 2))
        stores.ui.participants.actions.put(data as PlayingUser[])
        stores.ui.participants.actions.put(Object.values(data))
      },
    )

    socket.on(
      socketEvents.history.update,
      (data: { history: FairnessResult[] }) => {
        logger.debug(socketEvents.history.update, JSON.stringify(data, null, 2))
        stores.ui.history.actions.put(data.history)
      },
    )

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('bet')
      socket.off('pong')
      socket.off('crash')
      socket.off('snapshot')
      socket.disconnect()
    }
  }, [socket])

  useEffect(() => {
    return autorun(() => {
      const currentState = shakeStores.fsm.model.value.get()
      if (currentState === 'end') {
        stores.ui.participants.actions.markRestAsLost()
      } else if (currentState === 'wait') {
        stores.ui.participants.actions.clear()
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={styles.base}>
      <div className={cx(styles.frame)}>
        <div
          className={styles.canvasContainer}
          style={{
            width: 1100,
            height: 567,
          }}
        >
          <DiceGame options={CANVAS_OPTIONS} />
        </div>
      </div>
      <UI
        onBet={(data) => {
          socket?.emit(socketEvents.users.bet, data)
        }}
        onCancelBet={() => {
          socket?.emit('users:cancel', currentUser)
        }}
      />
      <AudioPlayer
        currentState={currentState}
        music={shakeStores.settings.model.settings.get()?.music || false}
        sound={shakeStores.settings.model.settings.get()?.sound || false}
      />
    </div>
  )
})
