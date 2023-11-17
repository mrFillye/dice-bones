import { useApp } from '@pixi/react'
import { createAnimationFrameLoop } from '@sok/toolkit/hooks/useLoop'
import { Spine } from '@sok/toolkit/pixi/components/Spine'
import { observer } from 'mobx-react-lite'
import { memo, useEffect } from 'react'

import { assets } from './assets'
import { fsm } from './stores/fsm'
import { shaking } from './stores/shaking'

const animations = {
  transition: 'transition',
} as const

const animationsToPlay = {
  transition: [{ delay: 0, loop: false, name: animations.transition }],
}

export const Hand = observer(function Cat() {
  const currentState = fsm.model.value.get()

  switch (currentState) {
    case 'reset':
      return <TransitionHand />
    default:
      return undefined
  }
})

const SCALE = 0.5

export const TransitionHand = memo(function TransitionHand() {
  const app = useApp()

  return (
    <Spine
      path={assets.spines.hand}
      animations={animationsToPlay.transition}
      x={app.screen.width / 2}
      y={app.screen.height / 2}
      scale={SCALE}
    />
  )
})
