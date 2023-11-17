import { useApp } from '@pixi/react'
import { createAnimationFrameLoop } from '@sok/toolkit/hooks/useLoop'
import { PixiSpine, Spine } from '@sok/toolkit/pixi/components/Spine'
import { observer } from 'mobx-react-lite'
import { memo, useEffect, useRef } from 'react'

import { useGameApi } from './api'
import { assets } from './assets'
import { fsm } from './stores/fsm'
import { shaking } from './stores/shaking'

const animations = {
  waiting: 'idle',
  shaking: 'action',
  idle_shaking: 'idle_action',
  transition: 'transition',
} as const

const animationsToPlay = {
  waiting: [{ delay: 0, loop: true, name: animations.waiting }],
  shaking: [
    { delay: 0, loop: false, name: animations.shaking },
    { delay: 0, loop: false, name: animations.idle_shaking },
    { delay: 0, loop: false, name: animations.transition },
  ],
}

export const Cat = observer(function Cat() {
  const currentState = fsm.model.value.get()

  switch (currentState) {
    case 'reset':
      return <WaitingCat />
    case 'wait':
      return <WaitingCat />
    case 'shake':
      return <ShakingCat />
    default:
      return undefined
  }
})

const SCALE = 0.5

export const WaitingCat = memo(function WaitingCat() {
  const app = useApp()

  return (
    <Spine
      path={assets.spines.cat}
      animations={animationsToPlay.waiting}
      x={app.screen.width / 2}
      y={app.screen.height / 2}
      scale={SCALE}
    />
  )
})

export const ShakingCat = memo(function ShakingCat() {
  const app = useApp()
  const spineRef = useRef<PixiSpine>(null)

  useEffect(() => {
    const sprite = spineRef.current
    return createAnimationFrameLoop((dt) => {
      if (!sprite) {
        return
      }
      const currentTime = shaking.model.time
      if (currentTime > 3600 && sprite.alpha !== 0) {
        sprite.alpha -= 0.06
      }
    })
  }, [])

  return (
    <Spine
      path={assets.spines.cat}
      animations={animationsToPlay.shaking}
      x={app.screen.width / 2}
      y={app.screen.height / 2}
      scale={SCALE}
      ref={spineRef}
    />
  )
})
