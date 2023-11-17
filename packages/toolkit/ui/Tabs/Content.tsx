import { Fragment } from 'react'

import { useTabsContext } from './context'

export type ContentProps = {
  children: (active: string) => JSX.Element | null
}

export function Content({ children }: ContentProps) {
  const tabs = useTabsContext()

  return <Fragment key={tabs.active}>{children(tabs.active)}</Fragment>
}
