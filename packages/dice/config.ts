import { PIXI } from '@sok/toolkit/pixi/dependencies'

export const config = {
  multiplayerRows: 5,
  maxProfit: 999,
  axisTimeMaxSec: 20,
  fontFamily: 'RF Dewi Extended',
  shakingTime: 6650,
  resultTime: 7450,
  resetTime: 11000,
  transitionTime: 3900,
  paddings: 30,
  freeSpaces: {
    left: 120,
    right: 140,
    top: 200,
    bottom: 120,
  },
}

export const { freeSpaces } = config

export const workZone = {
  height: (app: PIXI.Application) => {
    return app.screen.height - freeSpaces.top - freeSpaces.bottom
  },
  width: (app: PIXI.Application) => {
    return app.screen.width - freeSpaces.left - freeSpaces.right
  },
  bounds: {
    minX: (app: PIXI.Application) => {
      return freeSpaces.left
    },
    maxX: (app: PIXI.Application) => {
      return app.screen.width - freeSpaces.right
    },
    minY: (app: PIXI.Application) => {
      return freeSpaces.top
    },
    maxY: (app: PIXI.Application) => {
      return app.screen.height - freeSpaces.bottom
    },
  },
}
