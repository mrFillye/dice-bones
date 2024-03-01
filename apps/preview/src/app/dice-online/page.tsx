import dynamic from 'next/dynamic'

const DiceOnline = dynamic(() => import('~/page/dice-online'), {
  ssr: false,
})

export default function Page() {
  return (
    <main className="pt-10 flex flex-col justify-center items-center">
      <DiceOnline />
    </main>
  )
}
