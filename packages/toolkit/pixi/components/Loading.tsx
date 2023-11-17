import { Text, useApp } from '@pixi/react'
import { memo, useMemo, useRef } from 'react'

import { Rectangle } from '.'
import { useMount } from '../../hooks'
import { PIXI } from '../dependencies'
import { load } from '../loader'
import { loadSpine } from '../spine-loader'

export type Assets = {
  spines?: Record<string, string>
  textures?: Record<string, string>
  sounds?: Record<string, string>
}

export async function loadAll(
  assets: Assets,
  onProgress: (percent: number) => void,
) {
  const spines = Object.keys(assets.spines ?? {})
  const textures = Object.keys(assets.textures ?? {})
  const sounds = Object.keys(assets.sounds ?? {})
  const totalToLoad = spines.length + textures.length + sounds.length
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

  const loadingSounds = sounds.map(async (key) => {
    const url = (assets.sounds as any)[key]
    await load(url).catch(() => {
      console.error(`Failed to load sound: ${url}`)
    })
    updateProgress()
  })

  await Promise.all([...loadingSpines, ...loadingTextures, ...loadingSounds])
}

export type Props = {
  onLoaded?: () => void
  fontFamily?: string
  assets: Assets
}

const Loading = memo<Props>(function Loading(props) {
  const fontFamily = props.fontFamily ?? 'Arial'
  const app = useApp()
  const progressRef = useRef<PIXI.Text>(null)

  useMount(() => {
    let isMounted = true
    loadAll(props.assets, (percent) => {
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

  const loadingStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: fontFamily,
        fontSize: 36,
        fill: 0xffffff,
      }),
    [fontFamily],
  )
  const progressStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: fontFamily,
        fontSize: 24,
        fill: 0xffffff,
      }),
    [fontFamily],
  )

  const x = app.screen.width / 2
  const y = app.screen.height / 2

  return (
    <>
      <Rectangle
        width={app.screen.width}
        height={app.screen.height}
        fill={0x07081a}
      />
      <Text x={x} y={y} anchor={0.5} style={loadingStyle} text="Loading..." />
      <Text
        ref={progressRef}
        x={x}
        y={y + 50}
        anchor={0.5}
        style={progressStyle}
        text="0%"
        alpha={0.7}
      />
    </>
  )
})

export default Loading
