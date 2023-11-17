import Link from 'next/link'
import { Button } from '~/flowbite'

const gameInfo = [
  {
    name: 'Dice-Online',
    link: '/demos/dice-online',
  },
]

export default function Page() {
  return (
    <main className="pt-10 flex flex-col justify-center items-center">
      <h1 className="text-3xl mb-10">Choose</h1>
      <div className="flex flex-col space-y-5">
        {gameInfo.map((game, index) => (
          <Link key={index} href={game.link}>
            <Button className="w-48">{game.name}</Button>
          </Link>
        ))}
      </div>
    </main>
  )
}
