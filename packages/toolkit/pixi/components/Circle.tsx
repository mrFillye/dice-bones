import { PixiComponent } from '@pixi/react'

import { PIXI } from '../dependencies'

export type CircleProps = {
  fill: number
  radius: number
  x?: number
  y?: number
  anchor?: number
  blendMode?: PIXI.BLEND_MODES
  alpha?: number
}

export const Circle = PixiComponent<CircleProps, PIXI.Graphics>('Circle', {
  config: {
    destroyChildren: false,
    destroy: true,
  },
  create: () => new PIXI.Graphics(),
  applyProps: function (instance, oldProps, newProps) {
    const { fill, x = 0, y = 0, radius, anchor } = newProps
    if (
      oldProps.fill !== fill ||
      oldProps.radius !== radius ||
      oldProps.x !== x ||
      oldProps.y !== y
    ) {
      instance.clear()
      instance.beginFill(fill)
      instance.drawCircle(x, y, radius)
      instance.endFill()
    }
    if (anchor !== undefined && oldProps.anchor !== anchor) {
      instance.pivot.set(radius * anchor, radius * anchor)
    }
    instance.alpha = newProps.alpha ?? 1
    instance.blendMode = newProps.blendMode ?? PIXI.BLEND_MODES.NORMAL
  },
})
