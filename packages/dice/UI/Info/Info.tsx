import cx from 'classnames'
import { AnimatePresence } from 'framer-motion'
import React, { useState } from 'react'

import Button from '../common/Button/Button'
import Modal from '../common/Modal/Modal'
import { useUIContext } from '../context'
import styles from './Info.module.scss'

export type Props = {
  className?: string
}

export default function Info({ className }: Props) {
  const { onModalOpen } = useUIContext()

  return (
    <div className={cx(styles.base, className)}>
      <Button
        className={styles.button}
        onClick={() => {
          onModalOpen('info')
        }}
      />
    </div>
  )
}
