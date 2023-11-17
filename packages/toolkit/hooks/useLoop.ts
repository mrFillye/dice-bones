import { useMount } from '.'

export function createIntervalLoop(
  callback: (delta: number) => void,
  fps = 60,
) {
  let lastTime = Date.now()
  const loop = () => {
    const now = Date.now()
    const delta = now - lastTime
    lastTime = now
    callback(delta)
  }
  const timerId = setInterval(loop, 1000 / fps)
  return () => {
    clearInterval(timerId)
  }
}

export function createAnimationFrameLoop(callback: (delta: number) => void) {
  let lastTime = Date.now()
  let rafId: number = 0
  let running = true
  const loop = () => {
    if (!running) {
      return
    }
    const now = Date.now()
    const delta = now - lastTime
    lastTime = now
    callback(delta)
    rafId = window.requestAnimationFrame(loop)
  }
  rafId = requestAnimationFrame(loop)
  return () => {
    running = false
    cancelAnimationFrame(rafId)
  }
}

/** Works with setInterval */
export function useIntervalLoop(callback: (delta: number) => void, fps = 60) {
  useMount(() => {
    return createIntervalLoop(callback, fps)
  })
}
