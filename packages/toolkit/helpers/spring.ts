export type SpringState = {
  position: {
    start: number
    current: number
    goal: number
  }
  velocity: number
}

export type OnUpdate = (state: SpringState) => void

export type onRest = (state: SpringState) => void

export type Callbacks = Partial<{
  onUpdate: OnUpdate
  onRest: onRest
}>

export type Config = {
  initialPosition?: number
  stiffness?: number
  damping?: number
  precision?: number
}

const noop = () => {}
export default function makeSpring(
  callbacks?: Callbacks,
  {
    initialPosition = 0,
    stiffness = 200,
    damping = 10,
    precision = 10,
  }: Config = {},
) {
  const state = {
    position: {
      start: initialPosition,
      current: initialPosition,
      goal: initialPosition,
    },
    velocity: 0,
  }
  let lastTime = performance.now()
  let raf = 0
  let onUpdate = callbacks?.onUpdate ?? noop
  let onRest = callbacks?.onRest ?? noop

  const interpolate = () => {
    const now = performance.now()
    const distance = state.position.goal - state.position.current
    const acceleration = stiffness * distance - damping * state.velocity
    const delta = Math.min((now - lastTime) / 1000, 1)
    lastTime = now
    const newVelocity = state.velocity + acceleration * delta
    const newPosition = state.position.current + newVelocity * delta

    const isComplete =
      Math.abs(newVelocity) < 1 / precision &&
      Math.abs(newPosition - state.position.goal) < 1 / precision

    state.position.current = isComplete ? state.position.goal : newPosition
    state.velocity = newVelocity
    onUpdate(state)

    if (!isComplete) {
      raf = requestAnimationFrame(interpolate)
    } else {
      onRest(state)
    }
  }

  return {
    setValue: (position = 0) => {
      cancelAnimationFrame(raf)
      lastTime = performance.now()
      state.position.current = position
      state.position.goal = position
      onUpdate(state)
    },
    transitionTo: (position = 0) => {
      cancelAnimationFrame(raf)
      lastTime = performance.now()
      state.position.start = position
      state.position.goal = position
      raf = requestAnimationFrame(interpolate)
    },
    destroy: () => {
      cancelAnimationFrame(raf)
    },
    setUpdateCallback: (callback: OnUpdate) => {
      onUpdate = callback
    },
    setRestCallback: (callback: onRest) => {
      onRest = callback
    },
    getState: () => state,
  }
}
