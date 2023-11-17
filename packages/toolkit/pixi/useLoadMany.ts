import { useLayoutEffect, useState } from 'react'

import { load } from './loader'

export interface UseLoadMany {
  <T = unknown>(path: string[]): T[] | undefined
  <R, T = any>(path: string[], transform: (resource: T) => R): R[] | undefined
}

export const useLoadMany: UseLoadMany = (
  path: string[],
  transform: (resource: any) => any = (res) => res,
) => {
  const [resource, setResource] = useState<any>()

  useLayoutEffect(() => {
    let isMounted = true

    const promises = path.map(async (pathItem) => {
      return transform(await load(pathItem))
    })
    Promise.all(promises).then((res) => {
      if (!isMounted) {
        return
      }
      setResource(res)
    })

    return () => {
      isMounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path])

  return resource
}
