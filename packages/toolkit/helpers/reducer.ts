import { Draft, produce } from 'immer'
import React, { useCallback, useReducer } from 'react'

type Actions<
  State,
  Handlers extends Record<string, (...args: any[]) => void>,
> = {
  [K in keyof Handlers]: (payload: Parameters<Handlers[K]>[1]) => {
    type: K
    payload: Parameters<Handlers[K]>[1]
  }
}

export function makeMiniSlice<State>(initialState: State) {
  return function makeActions<
    T extends Record<string, (state: Draft<State>, payload: any) => void>,
  >(handlers: T) {
    function reducer(
      state = initialState,
      action: {
        [K in keyof T]: {
          type: K
          payload: Parameters<T[K]>[1]
        }
      }[keyof T],
    ) {
      if (handlers.hasOwnProperty(action.type as any)) {
        return produce(state, (draft) => {
          handlers[action.type as any](draft, action.payload)
        })
      } else {
        return state
      }
    }

    const actions = Object.fromEntries(
      Object.entries(handlers).map(([type, handler]) => [
        type,
        (payload: any) => ({ type, payload }),
      ]),
    ) as Actions<State, T>

    return {
      initialState,
      reducer,
      actions,
    }
  }
}

export type InferAction<Reducer extends (...args: any[]) => any> =
  Parameters<Reducer>[1]

export function useReducerWithMiddleware<
  Reducer extends React.Reducer<any, any>,
  Action extends React.ReducerAction<Reducer>,
  State extends React.ReducerState<Reducer>,
  Middleware extends (
    state: State,
    action: Action,
    dispatch: React.Dispatch<Action>,
  ) => (next: (action: Action) => void) => void,
>(
  reducer: Reducer,
  initialState: State,
  middleware: Middleware,
): [State, React.Dispatch<Action>] {
  const [state, dispatch] = useReducer(reducer, initialState)

  useCallback(
    function dispatchWithMiddleware(action: Action) {
      function next(action: Action) {
        dispatch(action)
      }
      middleware(state, action, dispatch)(next)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state],
  )

  return [state, dispatch]
}
