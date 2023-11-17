import createCubic from '@sok/toolkit/helpers/cubic'

import { config } from './config'

const FACTOR = 0.00006
const START_ROTATION_PERCENT = 0.15
const END_ROTATION_PERCENT = 0.64
export const GRAPHIC_STRENGTH_CURVE = {
  X: 0.74,
  Y: 1,
}

const animationYBezier = createCubic(0.46, 0, 0.6, 0.97)
const animationRotateBezier = createCubic(0.36, 0.08, 0.84, 0.47)

export function calculateMultiplayer(ms: number) {
  return Math.pow(Math.E, FACTOR * ms)
}

export function calculateTimeByMultiplayer(multiplayer: number) {
  return Math.log(multiplayer) / FACTOR
}

export function calculateClampedMultiplayer(ms: number) {
  return Math.min(config.maxProfit, calculateMultiplayer(ms))
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function getYPercent(xPercent: number) {
  return animationYBezier(xPercent)
}

export function rotateRocket(xPercent: number) {
  const toTopR = Math.PI / 2
  // will grow
  const endRotation =
    toTopR * END_ROTATION_PERCENT * animationRotateBezier(xPercent)
  // will decrease
  const startRotation = toTopR * START_ROTATION_PERCENT * (1 - xPercent)
  return toTopR - endRotation - startRotation
}

export function flewPercentTime(flewSeconds: number) {
  return flewSeconds / config.axisTimeMaxSec
}
