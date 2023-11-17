import { AnimatePresence, motion } from 'framer-motion'

import { useUIContext } from '../../context'
import Button from '../Button/Button'
import Bets from './Bets/Bets'
import Info from './Info/Info'
import styles from './Modal.module.scss'

const dropIn = {
  hidden: {
    y: '-100vh',
    opacity: 0,
  },
  visible: {
    y: '0',
    opacity: 1,
    transition: {
      duration: 0.3,
      type: 'spring',
      damping: 25,
      stiffness: 300,
    },
  },
  open: {
    y: '100vh',
    opacity: 0,
  },
}

export default function Modal() {
  const { onModalOpen, modalId } = useUIContext()

  return (
    <AnimatePresence initial={false} key="modal">
      {modalId !== 'hidden' && (
        <div className={styles.base} onClick={() => onModalOpen('hidden')}>
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className={styles.content}
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Button
              className={styles.button}
              onClick={() => onModalOpen('hidden')}
            />
            {(() => {
              switch (modalId) {
                case 'bets':
                  return <Bets />

                case 'info':
                  return <Info />

                default:
                  throw new Error('Unknown modal')
              }
            })()}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
