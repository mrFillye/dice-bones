import { useApp } from '@pixi/react'
import { Texture } from 'pixi.js'
import { useEffect, useState } from 'react'

export function useFullScreen(
  texture: Texture | undefined,
  position: 'center' | 'none',
  size: 'cover' | 'contain',
) {
  const [bounds, setBounds] = useState({ width: 0, height: 0, x: 0, y: 0 })
  const app = useApp()

  useEffect(() => {
    if (!texture) {
      return
    }
    const { screen } = app
    const clampRatio = size === 'cover' ? Math.max : Math.min
    const ratio = clampRatio(
      screen.width / texture.width,
      screen.height / texture.height,
    )
    const width = texture.width * ratio
    const height = texture.height * ratio
    setBounds({
      width,
      height,
      x: position === 'none' ? 0 : (screen.width - width) / 2,
      y: position === 'none' ? 0 : (screen.height - height) / 2,
    })
  }, [texture, app, position, size])

  return bounds
}
