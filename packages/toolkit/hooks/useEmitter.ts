import { useMemo } from 'react'

export type Emitter<T extends { [K in keyof T]: (...args: any) => any }> = {
  on: <K extends keyof T>(key: K, fn: T[K]) => () => void
  off: <K extends keyof T>(key: K, fn: T[K]) => void
  trigger: <K extends keyof T>(key: K, ...args: Parameters<T[K]>) => void
}

/**
 * Allows to emit events and subscribe to them.
 */
export function useEmitter<
  T extends {
    [K in keyof T]: (...args: any) => any
  },
>(): Emitter<T> {
  return useMemo(() => {
    const events: Record<
      string | number | symbol,
      Set<(...args: any) => any>
    > = {}

    const get = (key: string | number | symbol) => {
      if (events[key]) {
        return events[key]
      }
      events[key] = new Set()
      return events[key]
    }

    const off = <K extends keyof T>(key: K, fn: T[K]) => {
      get(key).delete(fn)
    }

    const on = <K extends keyof T>(key: K, fn: T[K]) => {
      get(key).add(fn)
      return () => off(key, fn)
    }

    const trigger = <K extends keyof T>(key: K, ...args: Parameters<T[K]>) => {
      for (const value of get(key).values()) {
        value(...(args as never[]))
      }
    }

    return { on, off, trigger }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
