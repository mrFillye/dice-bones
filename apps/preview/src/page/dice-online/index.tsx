'use client'

import { GameApiProvider } from '@sok/dice'
import localFont from 'next/font/local'
import { redirect, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { GameFrame } from './GameFrame/GameFrame'
import { SocketProvider } from './SocketProvider'
import { useAdaptiveMode } from './use-adaptive-mode'

const rfDewiExtended = localFont({
  src: [
    {
      path: '../../fonts/rf-dewi-extended/RFDewiExtended-Regular.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../fonts/rf-dewi-extended/RFDewiExtended-Bold.woff2',
      weight: '700',
      style: 'bold',
    },
    {
      path: '../../fonts/rf-dewi-extended/RFDewiExtended-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../fonts/rf-dewi-extended/RFDewiExtended-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../fonts/rf-dewi-extended/RFDewiExpanded-BlackItalic.woff2',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-rf-dewi-extended',
  preload: true,
})

const molot = localFont({
  src: [
    {
      path: '../../fonts/test/Molot.otf',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-molot',
  preload: true,
})

export default function Crash() {
  const adaptiveMode = useAdaptiveMode()

  const { get } = useSearchParams()

  const id = get('id')
  const name = get('name')
  const balance = get('balance')

  const isLogin = localStorage.getItem('isLogin')

  useEffect(() => {
    window.addEventListener('beforeunload', (test) => {
      localStorage.removeItem('isLogin')
    })
  }, [])

  useEffect(() => {
    if (isLogin) return

    redirect(`/login?id=${id}&balance=${balance}&name=${name}`)
  }, [])

  return (
    <div className={`${molot.className} ${rfDewiExtended.className}`}>
      <GameApiProvider
        adaptiveMode={adaptiveMode}
        fontFamily={{
          main: rfDewiExtended.style.fontFamily,
          additional: molot.style.fontFamily,
        }}
      >
        <SocketProvider>
          <GameFrame />
        </SocketProvider>
      </GameApiProvider>
    </div>
  )
}
