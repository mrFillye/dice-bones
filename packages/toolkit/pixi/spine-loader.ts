import { SkeletonData } from '@pixi-spine/runtime-4.1'
import 'pixi-spine'
import { TextureAtlas } from 'pixi-spine'
import * as PIXI from 'pixi.js'

export async function loadSpineAtlas(path: string) {
  const pathArray = path.split('/')
  const folder = pathArray.slice(0, pathArray.length - 1).join('/')
  const name = path.split('/').pop()?.replace('.json', '')

  const atlasPath = `${folder}/${name}.atlas`
  const rawAtlas = await fetch(atlasPath).then((res) => res.text())
  return new TextureAtlas(rawAtlas, function (line, callback) {
    callback(PIXI.BaseTexture.from(`${folder}/${line}`))
  })
}

export type LoadedSpine = {
  spineData: SkeletonData
  spineAtlas: TextureAtlas
}

export function getFromCache(path: string): LoadedSpine | undefined {
  if (PIXI.Assets.cache.has(path)) {
    return PIXI.Assets.cache.get(path)
  }
  return undefined
}

export async function loadSpine(path: string): Promise<LoadedSpine> {
  if (PIXI.Assets.cache.has(path)) {
    return PIXI.Assets.cache.get(path)
  }
  return loadSpineAtlas(path).then((spineAtlas) => {
    PIXI.Assets.add(path, path, {
      spineAtlas,
    })
    return PIXI.Assets.load(path)
  })
}
