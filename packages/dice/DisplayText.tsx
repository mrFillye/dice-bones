import { Container, Text, useApp } from '@pixi/react'
import { PIXI } from '@sok/toolkit/pixi/dependencies'
import { computed } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'

import { useGameApi } from './api'
import { fsm } from './stores/fsm'
import { waiting } from './stores/waiting'

type Size = 'sm' | 'md'

function formatTime(ms: number) {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  return `${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60)
    .toString()
    .padStart(2, '0')}`
}

export const DisplayText = observer(function DisplayText() {
  const currentState = fsm.model.value.get()
  const api = useGameApi()
  const app = useApp()

  const descriptionStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: api.options.fontFamily?.additional,
        fontSize: 12,
        fontWeight: '600',
        fill: 0xffffff,
      }),
    [api.options.fontFamily],
  )

  const x =
    api.options.adaptiveMode === 'desktop' ? 485 : app.screen.width / 2 + 70
  const y = api.options.adaptiveMode === 'desktop' ? 70 : 440

  const textX = api.options.adaptiveMode === 'desktop' ? 36 : 24
  const textY = api.options.adaptiveMode === 'desktop' ? 10 : 10

  const description = 'START IN'

  return (
    <Container x={x} y={y}>
      {currentState === 'wait' && (
        <>
          <Text
            style={descriptionStyle}
            alpha={1}
            text={description}
            x={textX}
            y={textY}
          />
          <Timer size={api.options.adaptiveMode === 'desktop' ? 'md' : 'sm'} />
        </>
      )}
    </Container>
  )
})

const Timer = observer<{ size: Size }>(function Timer({ size }) {
  const api = useGameApi()

  const time = computed(() => formatTime(waiting.model.remainingTime)).get()

  const timerStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: api.options.fontFamily?.additional,
        fontSize: getFontSize(size),
        fontWeight: '700',
        fill: 0xffffff,
      }),
    [api.options.fontFamily, size],
  )

  return <Text y={16} style={timerStyle} text={time} />
})

function getFontSize(size: Size): number {
  return size === 'md' ? 48 : 36
}
