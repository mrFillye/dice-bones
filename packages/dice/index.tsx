'use client'

import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { useSearchParams } from 'next/navigation'
import 'pixi-spine'
import { useCallback, useEffect } from 'react'

import { Cat } from './Cat'
import { DisplayText } from './DisplayText'
import { Hand } from './Hand'
import { Loading } from './Loading'
import { Logic } from './Logic'
import { Screen, Props as ScreenProps } from './Screen'
import { Table } from './Table/Table'
import { UI } from './UI/UI'
import { GameApiProvider, shakeStores, useGameApi } from './api'
import { checkPoint, getResult, initGame } from './api/play'
import { stores } from './stores'
import { fsm } from './stores/fsm'
import { PLAYER_ACCOUNT_STATE } from './stores/player/player-account'
import { currentUser } from './stores/ui/current-user'

export { GameApiProvider, stores, useGameApi, UI }

export type Props = Omit<ScreenProps, 'children'> & {}

export type Player = {
  id: number
  balance: number
  hash: string
  user_id: string
  isNew: boolean
  account_id: number
}

export const DiceGame = observer(function DiceGame(props: Props) {
  const isLoading = fsm.computes.matches('loading')

  const { get } = useSearchParams()

  const { player } = shakeStores

  const { setUser } = player.action

  const acc = player.computes.player.playerData.get()

  const { setUser: setIncomeUser, reset } = currentUser.actions

  const id = get('user_id')
  const balance = get('balance')
  const name = get('name')

  const { data } = useQuery<{ user: Player }>(['initGame'], async () =>
    initGame({ id: Number(id), balance: Number(balance), name: String(name) }),
  )

  useEffect(() => {
    if (!id || !balance || !name) return

    const account = data?.user

    if (account && !account?.isNew) {
      const payload = {
        id: Number(account.user_id),
        balance: account.balance,
        name: String(name),
        state: PLAYER_ACCOUNT_STATE.IDLE,
        hash: account.hash,
        account_id: account.account_id,
      }

      setUser(payload)

      setIncomeUser({
        id: String(account.user_id),
        state: 'idle',
        name: name,
        avatar: '',
      })

      return
    }

    if (!account) return

    const payload = {
      id: Number(account.user_id),
      balance: Number(account.balance),
      name,
      state: PLAYER_ACCOUNT_STATE.IDLE,
      hash: account.hash,
      account_id: account.account_id,
    }

    setUser(payload)

    setIncomeUser({
      id: String(account.user_id),
      state: 'idle',
      name: name,
      avatar: '',
    })

    return () => {
      reset()
    }
  }, [id, balance, name, data?.user])

  const handleLoaded = useCallback(() => {
    if (!player) return
    fsm.actions.send({ type: 'LOADED' })
  }, [])

  return (
    <Screen options={props.options}>
      <Logic />
      {isLoading ? (
        <Loading onLoaded={handleLoaded} />
      ) : (
        <>
          {/* @ts-ignore */}
          <Table type="default" />
          <Cat />
          {/* @ts-ignore */}
          <Table type="reset" />
          <Hand />
          <DisplayText />
        </>
      )}
    </Screen>
  )
})

export default DiceGame
