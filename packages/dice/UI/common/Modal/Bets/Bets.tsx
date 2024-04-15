import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { useGameApi } from '../../../../api'
import { IParticipant, getParticipantHistory } from '../../../../api/queries'
import styles from './Bets.module.scss'
import Pagination from './Pagination/Pagination'
import Section from './Section/Section'

export default function Bets() {
  const [currentPage, setCurrentPage] = useState<number>(1)

  const api = useGameApi()

  const { data: participant, refetch } = useQuery<{
    currentPage: number
    totalPages: number
    result: IParticipant[]
  }>({
    queryKey: ['participant-history'],
    queryFn: async () => await getParticipantHistory(currentPage),
  })

  useEffect(() => {
    refetch()
  }, [currentPage])

  return (
    <div className={styles.base}>
      <div
        className={styles.title}
        style={{ fontFamily: api.options.fontFamily?.additional }}
      >
        BETS HISTORY
      </div>
      <div className={styles.content}>
        <span className={styles.col}>Date and Time</span>
        <span className={styles.col}>Bet amount</span>
        {api.options.adaptiveMode === 'desktop' && (
          <span className={styles.col}>Result</span>
        )}
        <span className={styles.col}>Win amount</span>
      </div>
      {participant?.result?.map(({ id, ...item }) => {
        return (
          <div key={id}>
            <Section id={id} {...item} />
          </div>
        )
      })}
      {participant && (
        <Pagination
          current={currentPage}
          max={participant?.totalPages}
          onClick={setCurrentPage}
          className={styles.pagination}
        />
      )}
    </div>
  )
}
