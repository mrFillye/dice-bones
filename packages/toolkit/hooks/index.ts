import {
  DependencyList,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react'
import { State } from 'xstate'

import makeSpring, {
  Callbacks as SpringCallbacks,
  Config as SpringConfig,
} from '../helpers/spring'
import { useAutorun } from './useAutorun'
import { CopyState, useCopy } from './useCopy'
import { Emitter, useEmitter } from './useEmitter'
import { useIntervalLoop } from './useLoop'

export { useIntervalLoop, useEmitter, useAutorun, useCopy }
export type { Emitter, CopyState }

const STATIC_DEPS: DependencyList = []

/**
 * This is proposal: https://github.com/reactjs/rfcs/pull/220
 *
 * See also: https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md
 *
 * Example to use:
 * ```tsx
 * function Foo() {
 *   const [text, setText] = useState('');
 *
 *   const handleClick = useEvent(() => {
 *       sendMessage(text);
 *   });
 *
 *   // SendButton has memo HOC wrapper
 *   return <SendButton onClick={handleClick} />;
 * }
 * ```
 */
export function useEvent<A extends any[], R>(handler: (...args: A) => R) {
  const handlerRef = useRef(handler)

  useLayoutEffect(() => {
    handlerRef.current = handler
  })

  return useCallback((...args: A) => {
    const fn = handlerRef.current
    return fn(...args)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, STATIC_DEPS)
}

export const useMachineStateEffect = <T extends State<any, any, any, any, any>>(
  callback: (state: T) => (() => void) | void,
  state: T,
  event: string | Record<string, string>,
  deps: any[] = [],
) => {
  useEffect(() => {
    if (state.matches(event)) {
      return callback(state)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, event, ...deps])
}

export const useMount = (callback: () => (() => void) | void) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => callback(), [])
}

export const useUnmount = (callback: () => void) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => callback, [])
}

export function useSpring(
  callbacks?: SpringCallbacks,
  config: SpringConfig = {},
) {
  const { setUpdateCallback, setRestCallback, spring } = useMemo(() => {
    const { setRestCallback, setUpdateCallback, ...restSpring } = makeSpring(
      callbacks,
      config,
    )
    return {
      spring: restSpring,
      setRestCallback,
      setUpdateCallback,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    config.damping,
    config.stiffness,
    config.precision,
    config.initialPosition,
  ])
  useUnmount(spring.destroy)

  // update callbacks for keep closure fresh
  if (callbacks) {
    if (callbacks.onRest) {
      setRestCallback(callbacks.onRest)
    }
    if (callbacks.onUpdate) {
      setUpdateCallback(callbacks.onUpdate)
    }
  }

  return spring
}
