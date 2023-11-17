import cx from 'classnames'
import { useState } from 'react'

import Button from '../common/Button/Button'
import Content from './Content/Content'
import styles from './Settings.module.scss'

export type Props = {
  className?: string
}

export default function Settings({ className }: Props) {
  const [isOpened, setOpened] = useState(false)

  const handleClick = () => {
    setOpened((prev) => !prev)
  }

  return (
    <div className={cx(styles.base, className)}>
      <Button className={styles.button} onClick={() => setOpened(!isOpened)} />

      <div
        className={cx(
          styles.settingPanel,
          isOpened && styles.settingPanel__opened,
        )}
      >
        <Content onClick={handleClick} />
      </div>
    </div>
  )
}
