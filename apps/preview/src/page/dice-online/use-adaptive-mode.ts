import { AdaptiveMode } from '@sok/dice/api'
import { useEffect, useState } from 'react'

function getAdaptiveMode() {
  return window.innerWidth < 1024 ? 'mobile' : 'desktop'
}

export function useAdaptiveMode() {
  const [adaptiveMode, setAdaptiveMode] =
    useState<AdaptiveMode>(getAdaptiveMode)

  useEffect(() => {
    const handleResize = () => {
      setAdaptiveMode(getAdaptiveMode)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return adaptiveMode
}
