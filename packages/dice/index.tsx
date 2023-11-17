'use client'

import { observer } from 'mobx-react-lite'
import 'pixi-spine'
import { useCallback } from 'react'

import { Cat } from './Cat'
import { DisplayText } from './DisplayText'
import { Hand } from './Hand'
import { Loading } from './Loading'
import { Logic } from './Logic'
import { Screen, Props as ScreenProps } from './Screen'
import { Table } from './Table/Table'
import { UI } from './UI/UI'
import { GameApiProvider, useGameApi } from './api'
import { stores } from './stores'
import { fsm } from './stores/fsm'

export { GameApiProvider, stores, useGameApi, UI }

export type Props = Omit<ScreenProps, 'children'> & {}

export const DiceGame = observer(function DiceGame(props: Props) {
  const isLoading = fsm.computes.matches('loading')

  const handleLoaded = useCallback(() => {
    fsm.actions.send({ type: 'LOADED' })
  }, [])

  return (
    <Screen options={props.options}>
      <Logic />
      {isLoading ? (
        <Loading onLoaded={handleLoaded} />
      ) : (
        <>
          <Table type="default" />
          <Cat />
          <Table type="reset" />
          <Hand />
          <DisplayText />
        </>
      )}
    </Screen>
  )
})

export default DiceGame
