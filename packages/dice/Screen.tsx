'use client'

import { AppContext, Stage } from '@pixi/react'
import * as PIXI from 'pixi.js'
import React, { memo } from 'react'

import { GameAPIContext } from './api'

export type Props = React.PropsWithChildren<{
  options?: Partial<PIXI.IApplicationOptions>
}>

export const Screen = memo(function Screen(props: Props) {
  return (
    <GameAPIContext.Consumer>
      {(api) => (
        <AppContext.Consumer>
          {() => (
            <Stage
              {...props.options}
              width={props.options?.width}
              height={props.options?.height}
            >
              <GameAPIContext.Provider value={api}>
                {props.children}
              </GameAPIContext.Provider>
            </Stage>
          )}
        </AppContext.Consumer>
      )}
    </GameAPIContext.Consumer>
  )
})
