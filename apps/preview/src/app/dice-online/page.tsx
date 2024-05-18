import dynamic from 'next/dynamic'

import './index.css'

const DiceOnline = dynamic(() => import('~/page/dice-online'), {
  ssr: false,
})

export default function Page() {
  return (
    <main className="dice-online flex flex-col justify-center items-center">
      <DiceOnline />
    </main>
  )
}
