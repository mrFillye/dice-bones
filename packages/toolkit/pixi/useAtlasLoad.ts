import { Rectangle, Texture } from 'pixi.js'

import { PIXI } from './dependencies'
import { useLoad } from './useLoad'

export type Config = {
  width: number
  height: number
  frames: number
}

export function useAtlasLoad(path: string, config: Config) {
  return useLoad(path, (texture: Texture) => {
    if (process.env.NODE_ENV !== 'production') {
      console.assert(
        texture instanceof Texture,
        'texture should be an instance of PIXI.Texture',
        texture,
      )
    }

    const { width, height, frames } = config
    const framesPerRow = Math.floor(texture.width / width)
    const result: Texture[] = new Array(frames)
    for (let frame = 0; frame < frames; frame++) {
      const x = (frame % framesPerRow) * width
      const y = Math.floor(frame / framesPerRow) * height

      const id = `${path}-frame:${frame}`
      const cachedFrameTexture = PIXI.utils.TextureCache[id]
      if (cachedFrameTexture) {
        result[frame] = cachedFrameTexture
      } else {
        const rect = new Rectangle(x, y, width, height)
        const frameTexture = new Texture(texture.baseTexture, rect)
        Texture.addToCache(frameTexture, id)
        result[frame] = frameTexture
      }
    }
    return result
  })
}
