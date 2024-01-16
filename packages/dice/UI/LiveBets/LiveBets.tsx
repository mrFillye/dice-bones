import cx from 'classnames'
import { observer } from 'mobx-react-lite'

import { currentUser } from '../../stores/ui/current-user'
import { participants } from '../../stores/ui/participants'
import styles from './LiveBets.module.scss'
import ResultRow from './ResultRow/ResultRow'
import Row from './Row/Row'

export type Props = {
  className?: string
}

export const LiveBets = observer(function LiveBets({ className }: Props) {
  const currentUserId = currentUser.computes.userId.get()
  const participantList = participants.computes.participantsListWithUser(
    5,
    currentUserId,
  )

  return (
    <div className={cx(styles.base, className)}>
      {participantList.map((participant, index) => {
        if (participant.state === 'win') {
          return <ResultRow key={index} participant={participant} />
        }
        if (participant.state === 'idle') {
          return <Row key={index} participant={participant} />
        }
      })}
    </div>
  )
})
