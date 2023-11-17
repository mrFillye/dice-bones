import { SkeletonData } from '@pixi-spine/runtime-4.1'
import { PixiComponent } from '@pixi/react'
import { IAnimationStateListener, Spine as PixiSpine } from 'pixi-spine'
import * as PIXI from 'pixi.js'
import { forwardRef, useEffect, useLayoutEffect, useState } from 'react'

import { shallow } from '../../helpers/shallow'
import { LoadedSpine, getFromCache, loadSpine } from '../spine-loader'

export { PixiSpine }

export type AnimationTrack = {
  index: number
  name: string
  loop: boolean
  delay: number
}

type SpineComponentProps = {
  tintRgb?: number[] | Float32Array
  data: SkeletonData
  x?: number
  y?: number
  scale?: number
  timeScale?: number
  rotation?: number
  alpha?: number
  visible?: boolean
  interactive?: boolean
  anchor?: PIXI.Point
  animations?: (Omit<AnimationTrack, 'index' | 'delay'> & { delay?: number })[]
  on?: IAnimationStateListener
  zIndex?: number
}

const SpineComponent = PixiComponent<SpineComponentProps, PixiSpine>('Spine', {
  config: {
    destroyChildren: false,
    destroy: true,
  },
  create: function (props) {
    return new PixiSpine(props.data as any)
  },
  applyProps: function (instance, oldProps, newProps) {
    const {
      tintRgb,
      animations,
      scale,
      timeScale,
      data: _,
      on,
      ...props
    } = newProps
    if (tintRgb) {
      instance.tint = PIXI.utils.rgb2hex(tintRgb)
    }

    if (shallow(on, oldProps?.on) === false) {
      instance.state.clearListeners()
      if (on) {
        instance.state.addListener(on)
      }
    }

    if (animations && animations !== oldProps?.animations) {
      instance.skeleton.setToSetupPose()
      instance.state.clearTracks()
      animations.forEach((animation, index) => {
        const { delay = 0 } = animation
        const prevAnimation = animations[index - 1]
        if (prevAnimation) {
          const prevDuration = instance.spineData.findAnimation(
            prevAnimation.name,
          )!.duration

          return instance.state.addAnimation(
            index,
            animation.name,
            animation.loop,
            delay + prevDuration,
          )
        }
        instance.state.addAnimation(
          index,
          animation.name,
          animation.loop,
          delay,
        )
      })
    }

    if (typeof scale === 'number') {
      instance.scale.set(scale)
    }
    if (typeof timeScale === 'number') {
      instance.state.timeScale = timeScale
    }

    Object.keys(props).forEach((key) => {
      // @ts-ignore
      instance[key] = props[key]
    })
  },
})

export type Props = {
  path: string
  onLoaded?: () => void
} & Omit<SpineComponentProps, 'data'>

export const Spine = forwardRef<PixiSpine, Props>(function Spine(
  { path, onLoaded, ...restProps },
  ref,
) {
  const [resource, setResource] = useState<LoadedSpine | undefined>(() =>
    getFromCache(path),
  )

  useLayoutEffect(() => {
    let isMounted = true

    loadSpine(path).then((res) => {
      if (!isMounted) {
        return
      }
      setResource(res)
    })

    return () => {
      isMounted = false
    }
  }, [path])

  useEffect(() => {
    if (onLoaded && resource) {
      onLoaded()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource])

  if (!resource) {
    return null
  }

  return (
    <SpineComponent {...restProps} ref={ref as any} data={resource.spineData} />
  )
})
