import { PixiComponent } from '@pixi/react'

import { PIXI } from '../dependencies'

export type RectangleProps = {
  fill: number
  width: number
  height: number
  x?: number
  y?: number
  anchor?: number
  blendMode?: PIXI.BLEND_MODES
  alpha?: number
}

export const Rectangle = PixiComponent<RectangleProps, PIXI.Graphics>(
  'Rectangle',
  {
    config: {
      destroyChildren: false,
      destroy: true,
    },
    create: () => new PIXI.Graphics(),
    applyProps(instance, oldProps, newProps) {
      const { fill, x = 0, y = 0, width, height, anchor } = newProps
      if (
        oldProps.fill !== fill ||
        oldProps.width !== width ||
        oldProps.height !== height ||
        oldProps.x !== x ||
        oldProps.y !== y
      ) {
        instance.clear()
        instance.beginFill(fill)
        instance.drawRect(x, y, width, height)
        instance.endFill()
      }
      if (anchor !== undefined && oldProps.anchor !== anchor) {
        instance.pivot.set(width * anchor, height * anchor)
      }
      instance.alpha = newProps.alpha ?? 1
      instance.blendMode = newProps.blendMode ?? PIXI.BLEND_MODES.NORMAL
    },
  },
)
