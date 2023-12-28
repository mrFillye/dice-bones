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
import { GameApiProvider, useGameApi } from './api'
import { initUser } from './api/queries'
import { IUser } from './interfaces'
import { stores } from './stores'
import { fsm } from './stores/fsm'
import { currentUser } from './stores/ui/current-user'

export { GameApiProvider, stores, useGameApi, UI }

export type Props = Omit<ScreenProps, 'children'> & {}

export const DiceGame = observer(function DiceGame(props: Props) {
  const { get } = useSearchParams()

  const id = get('id')
  const balance = get('balance')
  const name = get('name')

  const { setUser, reset } = currentUser.actions

  const {
    data,
    isError,
    isLoading: isUserLoading,
  } = useQuery<{ user: IUser }>(['initUser'], async () =>
    initUser({ id: String(id), balance: String(balance), name: String(name) }),
  )

  const isLoading = fsm.computes.matches('loading')

  const handleLoaded = useCallback(() => {
    fsm.actions.send({ type: 'LOADED' })
  }, [])

  useEffect(() => {
    if (isUserLoading || isError) return

    if (data) {
      setUser({
        id: data.user.id,
        name: data.user.name,
        state: data.user.state,
        avatar: '',
      })
    }

    return () => {
      reset()
    }
  }, [data, currentUser])

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
