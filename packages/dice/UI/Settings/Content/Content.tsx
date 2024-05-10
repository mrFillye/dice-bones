import cx from 'classnames'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

import { shakeStores } from '../../../api'
import Toggle from '../../common/Toggle/Toggle'
import { useUIContext } from '../../context'
import styles from './Content.module.scss'

export type Props = {
  onClick: () => void
}

export default function Content({ onClick }: Props) {
  const { onModalOpen } = useUIContext()

  const { updateSettings } = shakeStores.settings.actions
  const currentSettings = shakeStores.settings.model.settings.get()

  const sound = localStorage.getItem('sound')
  const music = localStorage.getItem('music')

  const [settings, setSettings] = useState({
    sound: sound === 'true',
    music: music === 'true',
  })

  useEffect(() => {
    updateSettings(settings)

    localStorage.setItem('sound', String(settings.sound))
    localStorage.setItem('music', String(settings.music))
  }, [settings.music, settings.sound])

  return (
    <div className={styles.content}>
      <div className={styles.button} onClick={onClick} />
      <div className={styles.item}>
        <div className={styles.wrapper}>
          <div className={cx(styles.icon, styles.icon__clock)} />
          <span className={styles.label} onClick={() => onModalOpen('bets')}>
            History
          </span>
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.wrapper}>
          <div className={cx(styles.icon, styles.icon__rules)} />
          <span className={styles.label} onClick={() => onModalOpen('info')}>
            Rules
          </span>
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.wrapper}>
          <div className={cx(styles.icon, styles.icon__sound)} />
          <span className={styles.label}>Sound</span>
        </div>
        <Toggle
          toggled={settings.sound}
          onToggle={() => {
            setSettings({
              ...settings,
              sound: !settings.sound,
            })
          }}
        />
      </div>
      <div className={styles.item}>
        <div className={styles.wrapper}>
          <div className={cx(styles.icon, styles.icon__music)} />
          <span className={styles.label}>Music</span>
        </div>
        <Toggle
          toggled={settings.music}
          onToggle={() => {
            setSettings({
              ...settings,
              music: !settings.music,
            })
          }}
        />
      </div>
    </div>
  )
}
