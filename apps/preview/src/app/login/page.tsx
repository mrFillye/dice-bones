'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { Button } from '~/flowbite'

export default function Page() {
  const router = useRouter()

  const { get } = useSearchParams()

  const id = get('id')
  const name = get('name')
  const balance = get('balance')

  const handleEntering = () => {
    localStorage.setItem('isLogin', 'true')
    router.push(`/dice-online?id=${id}&balance=${balance}&name=${name}`)
  }

  return (
    <main className="pt-10 flex flex-col justify-center items-center h-100">
      <form
        action="
        "
      >
        <Button className="mt-40" onClick={handleEntering}>
          Играть
        </Button>
      </form>
    </main>
  )
}
