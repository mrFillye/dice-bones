import cx from 'classnames'
import React, { useState } from 'react'

import styles from './Toggle.module.scss'

export type Props = {
  toggled: boolean
  onToggle: () => void
}

export default function Toggle({ toggled, onToggle }: Props) {
  return (
    <div className={styles.base} onClick={onToggle}>
      <div className={cx(styles.block, toggled && styles.block__toggled)} />
    </div>
  )
}
