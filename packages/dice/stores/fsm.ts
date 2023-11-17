import { action, observable } from 'mobx'
import { computedFn } from 'mobx-utils'
import { createMachine, interpret } from 'xstate'

import { shaking } from './shaking'
import { waiting } from './waiting'

export type SendEvent =
  | {
      type: 'SHAKE'
      time: number
    }
  | {
      type: 'END'
      time: number
    }
  | {
      type: 'WAIT'
      time: number
    }
  | {
      type: 'TRANSITION'
    }
  | {
      type: 'RESULT'
      time: number
    }
  | {
      type: 'RESET'
      time: number
    }

type InternalMachineEvent =
  | SendEvent
  | {
      type: 'LOADED'
    }

export type Options = {
  fontFamily?: string
}

export const states = {
  loading: 'loading',
  loaded: 'loaded',
  wait: 'wait',
  shake: 'shake',
  transition: 'transition',
  end: 'end',
  result: 'result',
  reset: 'reset',
} as const

export type StateType = (typeof states)[keyof typeof states]

export type TypeState =
  | {
      value: typeof states.loading
      context: {}
    }
  | {
      value: typeof states.loaded
      context: {}
    }
  | {
      value: typeof states.wait
      context: {}
    }
  | {
      value: typeof states.shake
      context: {}
    }
  | {
      value: typeof states.transition
      context: {}
    }
  | {
      value: typeof states.end
      context: {}
    }
  | {
      value: typeof states.result
      context: {}
    }
  | {
      value: typeof states.reset
      context: {}
    }

const machine = createMachine<{}, InternalMachineEvent, TypeState>(
  {
    predictableActionArguments: true,
    id: 'dice-online',
    initial: states.loading,
    states: {
      [states.loading]: { on: { LOADED: 'loaded' } },
      [states.loaded]: {
        on: { SHAKE: 'shake', WAIT: 'wait' },
        entry: 'onLoaded',
      },
      [states.wait]: {
        entry: ['syncWait', 'onWait'],
        on: {
          END: 'end',
          SHAKE: 'shake',
          TRANSITION: 'transition',
          RESULT: 'result',
          WAIT: { actions: ['syncWait'] },
        },
      },
      [states.shake]: {
        on: {
          END: 'end',
          WAIT: 'wait',
          TRANSITION: 'transition',
          RESULT: 'result',
          SHAKE: { actions: ['syncShake'] },
        },
        entry: 'syncShake',
      },
      [states.transition]: {
        on: {
          END: 'end',
          WAIT: 'wait',
          RESULT: 'result',
          SHAKE: { actions: ['syncShake'] },
        },
        entry: 'syncShake',
      },
      [states.end]: {
        on: {
          WAIT: 'wait',
          RESULT: 'result',
          SHAKE: { actions: ['syncShake'] },
        },
        entry: 'syncShake',
      },
      [states.result]: {
        on: {
          WAIT: 'wait',
          RESET: 'reset',
          SHAKE: { actions: ['syncShake'] },
        },
        entry: 'syncShake',
      },
      [states.reset]: {
        on: {
          WAIT: 'wait',
          SHAKE: { actions: ['syncShake'] },
        },
        entry: 'syncShake',
      },
    },
  },
  {
    actions: {
      onLoaded: () => {},
      onWait: () => {
        shaking.actions.updateTime(0)
      },
      syncWait: (_, event) => {
        if (event.type === 'WAIT') {
          waiting.actions.updateRemainingTime(event.time)
        }
      },
      syncShake: (_, event) => {
        if (event.type === 'SHAKE') {
          shaking.actions.updateTime(event.time)
          shaking.actions.updateRunTime(Date.now() - event.time)
        }
      },
      end: (_, event) => {
        if (event.type === 'END') {
          shaking.actions.updateTime(event.time)
          shaking.actions.updateRunTime(Date.now() - event.time)
        }
      },
      result: (_, event) => {
        if (event.type === 'RESULT') {
          shaking.actions.updateTime(event.time)
        }
      },
    },
  },
)

const fsmMachine = interpret(machine).start()

const model = {
  value: observable.box(fsmMachine.initialState.value as StateType),
  machine: observable.box(fsmMachine.initialState),
}

export const fsm = {
  model,
  actions: {
    send: action((event: InternalMachineEvent) => {
      const newState = fsmMachine.send(event)

      if (newState.changed) {
        model.value.set(newState.value as StateType)
        model.machine.set(newState)
      }
    }),
  },
  computes: {
    matches: computedFn((state: StateType) => {
      return model.machine.get().matches(state)
    }),
  },
}
