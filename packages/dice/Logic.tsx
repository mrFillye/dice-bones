import {
  createAnimationFrameLoop,
  createIntervalLoop,
} from '@sok/toolkit/hooks/useLoop'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'

import { config } from './config'
import { fsm } from './stores/fsm'
import { shaking } from './stores/shaking'
import { waiting } from './stores/waiting'

export const Logic = observer(function Logic() {
  const currentState = fsm.model.value.get()

  useEffect(() => {
    if (currentState === 'loaded') {
      fsm.actions.send({ type: 'WAIT', time: 10000 })
    }
    if (currentState === 'wait') {
      return createAnimationFrameLoop((delta) => {
        const { remainingTime } = waiting.model
        const newRemainingTime = remainingTime - delta
        waiting.actions.updateRemainingTime(newRemainingTime)
      })
    } else if (
      currentState === 'shake' ||
      currentState === 'transition' ||
      currentState === 'end' ||
      currentState === 'result' ||
      currentState === 'reset'
    ) {
      shaking.actions.updateRunTime(Date.now() - shaking.model.time)
      return createIntervalLoop(() => {
        const { time } = shaking.model
        shaking.actions.updateTime(Date.now() - shaking.model.runTime)
        if (time >= config.resetTime) {
          fsm.actions.send({ type: 'RESET', time: time })
        }
        if (time >= config.resultTime) {
          fsm.actions.send({ type: 'RESULT', time: time })
        }
        if (time >= config.shakingTime) {
          fsm.actions.send({ type: 'END', time: time })
        }
        if (time >= config.transitionTime) {
          fsm.actions.send({ type: 'TRANSITION' })
        }
      }, 20)
    }
  }, [currentState])

  return null
})
