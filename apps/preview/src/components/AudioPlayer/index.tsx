import { stores } from '@sok/dice'
import { shakeStores } from '@sok/dice/api'
import React, { FC, useEffect, useRef, useState } from 'react'

interface IAudioPlayer {
  currentState: string
  music: boolean
  sound: boolean
}

const getCurrentAudioPath = (currentState: string) => {
  if (currentState === 'wait') return require('./font_game.mp3').default

  return require('./gawp.mp3').default
}

export const AudioPlayer: FC<IAudioPlayer> = ({
  currentState,
  music,
  sound,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null)

  const [musicIsMuted, setMusicIsMuted] = useState<boolean>(false)
  const [soundIsMuted, setSoundIsMuted] = useState<boolean>(false)

  useEffect(() => {
    if (currentState === 'shake' && !sound) {
      setSoundIsMuted(true)
    } else if (currentState === 'shake' && sound) {
      setSoundIsMuted(false)
    }
    if (currentState === 'wait' && !music) {
      setMusicIsMuted(true)
    } else if (currentState === 'wait' && music) {
      setMusicIsMuted(false)
    }
  }, [currentState, sound, music])

  useEffect(() => {
    if (!audioRef.current) return

    if (
      currentState === 'transition' ||
      currentState === 'result' ||
      currentState === 'end' ||
      currentState === 'reset'
    ) {
      audioRef.current?.pause()
    }
  }, [])

  useEffect(() => {
    const playAudio = () => {
      if (!audioRef.current) return

      audioRef.current.src = getCurrentAudioPath(currentState)
      audioRef.current.play()
    }

    if (currentState === 'wait' && music && !musicIsMuted) {
      playAudio()

      return
    }

    if (currentState === 'shake' && sound && !soundIsMuted) {
      playAudio()

      return
    }
  }, [currentState, sound, music, musicIsMuted, soundIsMuted])

  return (
    <audio
      ref={audioRef}
      muted={false}
      controls
      className="hidden"
      onEnded={() => {}}
    />
  )
}
