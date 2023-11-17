import { autorun } from 'mobx'
import { useEffect } from 'react'

export function useAutorun(fn: () => (() => void) | void, deps: any[]) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let cancel: (() => void) | void
    const dispose = autorun(() => {
      cancel = fn()
    })
    return () => {
      dispose()
      cancel?.()
    }
  }, deps)
}
