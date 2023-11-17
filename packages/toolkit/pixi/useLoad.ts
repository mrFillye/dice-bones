import { useLayoutEffect, useState } from 'react'

import { PIXI } from './dependencies'
import { load } from './loader'

export function getFromCache<T>(path: string): T | undefined {
  if (PIXI.Assets.cache.has(path)) {
    return PIXI.Assets.cache.get(path)
  }
  return undefined
}
export interface UseLoad {
  <R, T = any>(path: string, transform: (resource: T) => R): R | undefined
  <T = unknown>(path: string): T | undefined
  <T = unknown>(paths: string[]): T[] | undefined
  <R, T = any>(paths: string[], transform: (resource: T) => R): R[] | undefined
}

const identity: (resource: any) => any = (res) => res
export const useLoad: UseLoad = (
  path: string | string[],
  transform: (resource: any) => any = identity,
) => {
  const [resource, setResource] = useState<any>(() => {
    function convert(resPath: string): any {
      const cached = getFromCache(resPath)
      if (cached) {
        return transform(cached)
      }
      return undefined
    }

    if (Array.isArray(path)) {
      const res = path.map(convert)
      if (res.every((r) => r !== undefined)) {
        return res
      }
      return undefined
    } else {
      return convert(path)
    }
  })

  useLayoutEffect(() => {
    if (resource) {
      return
    }
    let isMounted = true

    if (Array.isArray(path)) {
      Promise.all(path.map(load)).then((res) => {
        if (!isMounted) {
          return
        }
        setResource(res.map(transform))
      })
    } else {
      load(path).then((res) => {
        if (!isMounted) {
          return
        }
        setResource(transform(res))
      })
    }

    return () => {
      isMounted = false
      setResource(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path])

  return resource
}
