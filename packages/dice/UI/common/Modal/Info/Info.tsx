import cx from 'classnames'
import React from 'react'

import { useGameApi } from '../../../../api'
import styles from './Info.module.scss'

export default function Info() {
  const api = useGameApi()

  return (
    <div className={styles.base}>
      <div
        className={styles.title}
        style={{ fontFamily: api.options.fontFamily?.additional }}
      >
        Welcome to the Bur Dice!
      </div>
      <div className={styles.content}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </div>
      <div
        className={styles.subtitle}
        style={{ fontFamily: api.options.fontFamily?.additional }}
      >
        How to play?
      </div>
      <div className={styles.paragraph}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </div>
    </div>
  )
}
