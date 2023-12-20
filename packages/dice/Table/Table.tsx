import { useApp } from '@pixi/react'
import { createAnimationFrameLoop } from '@sok/toolkit/hooks/useLoop'
import { PixiSpine, Spine } from '@sok/toolkit/pixi/components/Spine'
import { PIXI } from '@sok/toolkit/pixi/dependencies'
import { useLoad } from '@sok/toolkit/pixi/useLoad'
import { observer } from 'mobx-react-lite'
import { memo, useEffect, useRef } from 'react'

import { assets } from '../assets'
import { stores } from '../stores'
import { fsm } from '../stores/fsm'
import { shaking } from '../stores/shaking'
import { bone, changeSlotTextures } from './common'

const animations = {
  shake: 'idle',
  result: 'action',
} as const

const animationsToPlay = {
  shake: [{ delay: 0, loop: true, name: animations.shake }],
  result: [{ delay: 0, loop: false, name: animations.result }],
}

export type Props = {
  type: 'reset' | 'default'
}

export const Table = observer(function Table({ type }: Props) {
  const currentState = fsm.model.value.get()

  console.log('type', type)

  if (type === 'reset') {
    switch (currentState) {
      case 'end':
        return <ResultTable type={type} />
      case 'result':
        return <ResultTable type={type} />
      case 'reset':
        return <ResultTable type={type} />
      default:
        return undefined
    }
  }

  switch (currentState) {
    case 'shake':
      return <ShakeTable />
    case 'transition':
      return <ShakeTable />
    default:
      return undefined
  }
})

const SCALE = 0.5

const ShakeTable = memo(function ShakeTable() {
  const app = useApp()

  return (
    <Spine
      path={assets.spines.table}
      animations={animationsToPlay.shake}
      x={app.screen.width / 2}
      y={app.screen.height / 2}
      scale={SCALE}
    />
  )
})

const ResultTable = observer(function ResultTable({ type }: Props) {
  const app = useApp()
  const spineRef = useRef<PixiSpine>(null)
  const result = stores.ui.gameStore.model.game.get()?.result

  const shadow = useLoad<PIXI.Texture>(assets.textures.rib_shadow)
  const bones = [
    { key: bone.rib, texture: useLoad<PIXI.Texture>(assets.textures.rib) },
    { key: bone.one, texture: useLoad<PIXI.Texture>(assets.textures.one) },
    { key: bone.two, texture: useLoad<PIXI.Texture>(assets.textures.two) },
    { key: bone.three, texture: useLoad<PIXI.Texture>(assets.textures.three) },
    { key: bone.four, texture: useLoad<PIXI.Texture>(assets.textures.four) },
    { key: bone.five, texture: useLoad<PIXI.Texture>(assets.textures.five) },
    { key: bone.six, texture: useLoad<PIXI.Texture>(assets.textures.six) },
  ]

  const leftData = result ? bones[result[0]] : bones[0]
  const leftAsideTexture = bones[2].texture
  const rightData = result ? bones[result[1]] : bones[0]
  const rightAsideTexture = bones[4].texture

  useEffect(() => {
    const spine = spineRef.current
    if (!spine) {
      return
    }

    changeSlotTextures('left', leftData, shadow, leftAsideTexture, spine)
    changeSlotTextures('right', rightData, shadow, rightAsideTexture, spine)
  })

  useEffect(() => {
    const sprite = spineRef.current
    if (type !== 'reset') {
      return
    }

    return createAnimationFrameLoop((dt) => {
      if (!sprite) {
        return
      }
      const currentTime = shaking.model.time
      if (currentTime > 11300 && sprite.alpha !== 0) {
        sprite.alpha -= 0.06
      }
    })
  }, [])

  return (
    <Spine
      ref={spineRef}
      path={assets.spines.table}
      animations={animationsToPlay.result}
      x={app.screen.width / 2}
      y={app.screen.height / 2}
      scale={SCALE}
    />
  )
})
