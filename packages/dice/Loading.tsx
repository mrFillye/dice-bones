import { Sprite, Text, useApp } from '@pixi/react'
import { useMount } from '@sok/toolkit/hooks'
import { Rectangle } from '@sok/toolkit/pixi/components/Rectangle'
import { PIXI } from '@sok/toolkit/pixi/dependencies'
import { load } from '@sok/toolkit/pixi/loader'
import { loadSpine } from '@sok/toolkit/pixi/spine-loader'
import { useLoad } from '@sok/toolkit/pixi/useLoad'
import { memo, useMemo, useRef } from 'react'

import { useGameApi } from './api'
import { assets } from './assets'

type Texture = PIXI.Texture<PIXI.Resource>

const logoBaseSize = {
  width: 340,
  height: 220,
}

async function loadAll(onProgress: (percent: number) => void) {
  const spines = Object.keys(assets.spines)
  const textures = Object.keys(assets.textures)
  const totalToLoad = spines.length + textures.length
  const updateProgress = (() => {
    let loaded = 0
    return () => {
      loaded++
      onProgress(loaded / totalToLoad)
    }
  })()

  const loadingSpines = spines.map(async (key) => {
    const url = (assets.spines as any)[key]
    await loadSpine(url).catch(() => {
      console.error(`Failed to load spine: ${url}`)
    })
    updateProgress()
  })

  const loadingTextures = textures.map(async (key) => {
    const url = (assets.textures as any)[key]
    await load(url).catch(() => {
      console.error(`Failed to load texture: ${url}`)
    })
    updateProgress()
  })

  await Promise.all([...loadingSpines, ...loadingTextures])
}

export type Props = {
  onLoaded?: () => void
}

export const Loading = memo<Props>(function Loading(props) {
  const app = useApp()
  const progressRef = useRef<PIXI.Text>(null)
  const api = useGameApi()
  const logoTexture = useLoad<Texture>('/assets/loading-logo.svg')

  useMount(() => {
    let isMounted = true
    loadAll((percent) => {
      if (!isMounted || !progressRef.current) {
        return
      }
      progressRef.current.text = `${Math.round(percent * 100) | 0}%`
    }).then(() => {
      if (!isMounted) {
        return
      }
      props.onLoaded?.()
    })

    return () => {
      isMounted = false
    }
  })

  const progressStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: api.options.fontFamily?.main,
        fontSize: 24,
        fill: 0xffffff,
      }),
    [api.options.fontFamily],
  )

  const x = app.screen.width / 2
  const y = app.screen.height / 2

  // fill 1/4 of the screen with save proportions
  const logoSize = {
    width: app.screen.width / 4,
    height: (app.screen.width / 4) * (logoBaseSize.height / logoBaseSize.width),
  }

  return (
    <>
      <Rectangle
        width={app.screen.width}
        height={app.screen.height}
        fill={0x07081a}
      />

      <Text
        ref={progressRef}
        x={app.screen.width / 2}
        y={app.screen.height - 40}
        anchor={0.5}
        style={progressStyle}
        text="0%"
        alpha={0.7}
      />
    </>
  )
})
