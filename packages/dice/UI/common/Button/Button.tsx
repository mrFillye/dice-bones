import cx from 'classnames'
import React, { useState } from 'react'

import { useGameApi } from '../../../api'
import styles from './Button.module.scss'

export type Props = React.ComponentProps<'button'> & {
  className?: string
}

export default function Button(props: Props) {
  const api = useGameApi()

  return (
    <button
      className={cx(styles.base, props.className)}
      onClick={props.onClick}
      style={{ fontFamily: api.options.fontFamily?.additional }}
    >
      {props.children}
    </button>
  )
}
