import { sound, soundAsset } from '@pixi/sound'

import { PIXI } from './dependencies'

PIXI.extensions.add(soundAsset)

const loading = new Map<string, Promise<any>>()

export async function load(path: string) {
  if (PIXI.Assets.cache.has(path)) {
    return PIXI.Assets.cache.get(path)
  }

  if (loading.has(path)) {
    const res = await loading.get(path)
    return res
  }

  PIXI.Assets.add(path, path)
  loading.set(path, PIXI.Assets.load(path))
  const res = await PIXI.Assets.load(path)
  loading.delete(path)
  return res
}
