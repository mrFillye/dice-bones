import cx from 'classnames'
import React, { useEffect, useState } from 'react'

import { useGameApi } from '../../../../api'
import styles from './Bets.module.scss'
import Pagination from './Pagination/Pagination'
import Section from './Section/Section'

const mapRange = new Array(34).fill(0).map((item, index) => ({
  id: `${index}dsdsds`,
  date: '08.09, 12:30',
  bet: 300,
  result: '1-6',
  win: 150,
}))

const ELEMENT_PER_PAGE = 5

export default function Bets() {
  const [currentPage, setCurrentPage] = useState(1)
  const [data, setData] = useState(mapRange)
  const api = useGameApi()

  useEffect(() => {
    setData(
      [...mapRange].slice(
        (-1 + currentPage) * ELEMENT_PER_PAGE,
        ELEMENT_PER_PAGE * currentPage,
      ),
    )
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
      {data.map((item, index) => {
        return (
          <div key={item.id}>
            <Section {...item} />
          </div>
        )
      })}
      <Pagination
        current={currentPage}
        max={Math.ceil(mapRange.length / ELEMENT_PER_PAGE)}
        onClick={setCurrentPage}
        className={styles.pagination}
      />
    </div>
  )
}
