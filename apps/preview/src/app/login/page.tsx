'use client'

import { Alert, Spinner } from 'flowbite-react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { HiInformationCircle } from 'react-icons/hi'
import { P, match } from 'ts-pattern'
import { Button, TextInput } from '~/flowbite'
import { Result } from '~/helpers'

import { signIn } from './actions'

type Form = {
  password: string
}

type Query =
  | {
      type: 'success'
    }
  | {
      type: 'failure'
      message: string
    }
  | {
      type: 'pending'
    }
  | {
      type: 'idle'
    }

const getPage = (pathname: string) => {
  if (pathname.startsWith('/demos/')) {
    return pathname.replace('/demos/', '')
  }
  return 'home'
}

export default function Page() {
  const pathname = usePathname()
  const router = useRouter()
  const page = getPage(pathname)
  const [query, setQuery] = useState<Query>({ type: 'idle' })

  useEffect(() => {
    if (query.type === 'success') {
      router.refresh()
    }
  }, [query.type, router])

  return (
    <main className="pt-10 flex flex-col justify-center items-center">
      <h2 className="text-2xl my-10">Write the password to access</h2>
      <form
        className="flex flex-col space-y-5"
        onSubmit={() => {
          setQuery({ type: 'pending' })
        }}
        action={async (data) => {
          const form = Object.fromEntries(data.entries()) as unknown as Form
          const result = await signIn({
            ...form,
            page,
          })
          Result.match(result, {
            Ok: () => setQuery({ type: 'success' }),
            Err: (message) => setQuery({ type: 'failure', message }),
          })
        }}
      >
        <TextInput
          name="password"
          placeholder="Enter password..."
          type="password"
        />
        <Button
          disabled={query.type === 'pending' || query.type === 'success'}
          type="submit"
        >
          {match(query)
            .with({ type: 'success' }, () => <Spinner />)
            .with({ type: 'pending' }, () => <Spinner />)
            .otherwise(() => 'Enter')}
        </Button>
      </form>
      {query.type === 'failure' && (
        <Alert className="mt-10" color="failure" icon={HiInformationCircle}>
          {query.message}
        </Alert>
      )}
    </main>
  )
}
