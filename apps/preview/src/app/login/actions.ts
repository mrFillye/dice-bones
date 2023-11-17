'use server'

import { Effect, Either, pipe } from 'effect'
import { cookies } from 'next/dist/client/components/headers'
import { AuthPage, authConfig } from '~/auth-config'
import { Result } from '~/helpers'
import { effectResult } from '~/helpers/effect'

export type Response = Result.Result<void, string>

const pages = Object.keys(authConfig.passwords)
const isPage = (page: string): page is AuthPage => pages.includes(page)
const TOKEN_AGE = 60 * 60 * 24 * 30
const AUTH_COOKIE_KEY = 'auth-token'

export type Request = {
  page: string
  password: string
}
const createRunnable = (request: Request) => {
  return pipe(
    Effect.succeed(request),
    Effect.flatMap((request) => {
      if (!isPage(request.page)) {
        console.error(`Page must be one of: ${pages.join(', ')}`)
        return Effect.fail('Something went wrong')
      }
      const correctPassword = authConfig.passwords[request.page]
      if (request.password !== correctPassword) {
        return Either.left('Incorrect password')
      }
      return Effect.succeed(authConfig.tokens[request.page])
    }),
    Effect.flatMap((token) => {
      cookies().set(AUTH_COOKIE_KEY, token, {
        maxAge: TOKEN_AGE,
      })
      return Effect.succeed<void>(undefined)
    }),
    effectResult,
  )
}

export async function signIn(request: Request): Promise<Response> {
  const runnable = createRunnable(request)
  return Effect.runSync(runnable)
}
