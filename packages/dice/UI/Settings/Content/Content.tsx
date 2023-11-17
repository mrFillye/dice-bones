import cx from 'classnames'
import Image from 'next/image'
import React, { useState } from 'react'

import Button from '../../common/Button/Button'
import Toggle from '../../common/Toggle/Toggle'
import { useUIContext } from '../../context'
import styles from './Content.module.scss'

export type Props = {
  onClick: () => void
}

export default function Content({ onClick }: Props) {
  const { onModalOpen } = useUIContext()

  const [settings, setSettings] = useState({
    sound: false,
    music: true,
  })

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
