import { PIXI } from '../pixi/dependencies'

export function createGradientLegacy(
  colors: [position: number, color: string][],
  direction: 'horizontal' | 'vertical' = 'horizontal',
  size = { length: 256, width: 1 },
) {
  const canvas = document.createElement('canvas')
  if (direction === 'horizontal') {
    canvas.width = size.length
    canvas.height = size.width
  } else {
    canvas.width = size.width
    canvas.height = size.length
  }

  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Failed to create canvas context')
  }

  const gradient =
    direction === 'horizontal'
      ? ctx.createLinearGradient(0, 0, size.length, 0)
      : ctx.createLinearGradient(0, size.length, 0, 0)
  for (const [position, color] of colors) {
    gradient.addColorStop(position, color)
  }

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  return PIXI.Texture.from(canvas)
}

export type Colors = Array<[position: number, color: string]>
export function buildGradient(size: { width: number; height: number }) {
  const canvas = document.createElement('canvas')
  canvas.width = size.width
  canvas.height = size.height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Failed to create canvas context')
  }
  return ctx
}

export function addVertical(colors: Colors) {
  return (ctx: CanvasRenderingContext2D) => {
    const gradient = ctx.createLinearGradient(0, ctx.canvas.height, 0, 0)
    for (const [position, color] of colors) {
      gradient.addColorStop(position, color)
    }
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    return ctx
  }
}

export function fill(background = '#fff') {
  return (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = background
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    return ctx
  }
}

export function addHorizontal(colors: Colors) {
  return (ctx: CanvasRenderingContext2D) => {
    const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0)
    for (const [position, color] of colors) {
      gradient.addColorStop(position, color)
    }
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    return ctx
  }
}

export const toPixi = (ctx: CanvasRenderingContext2D) => {
  return PIXI.Texture.from(ctx.canvas)
}

export const gradientor = {
  build: buildGradient,
  addVertical,
  addHorizontal,
  fill,
  toPixi,
}

// export function createGradient(
//     colors: [position: number, color: string][],
//     direction: Direction = 'horizontal',
//     size = { length: 256, width: 1 },
// ) {
//     const canvas = document.createElement('canvas')
//     if (direction === 'horizontal') {
//         canvas.width = size.length
//         canvas.height = size.width
//     } else {
//         canvas.width = size.width
//         canvas.height = size.length
//     }

//     const ctx = canvas.getContext('2d')

//     if (!ctx) {
//         throw new Error('Failed to create canvas context')
//     }

//     const gradient =
//         direction === 'horizontal'
//             ? ctx.createLinearGradient(0, 0, size.length, 0)
//             : ctx.createLinearGradient(0, size.length, 0, 0)
//     for (const [position, color] of colors) {
//         gradient.addColorStop(position, color)
//     }

//     ctx.fillStyle = gradient
//     ctx.fillRect(0, 0, canvas.width, canvas.height)

//     return PIXI.Texture.from(canvas)
// }
