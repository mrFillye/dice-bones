import { Effect } from 'effect'
import { matchEffect } from 'effect/Effect'

import { Result } from '.'

export const effectResult = <R, E, A>(
  self: Effect.Effect<R, E, A>,
): Effect.Effect<R, never, Result.Result<A, E>> =>
  matchEffect(self, {
    onFailure: (e) => Effect.succeed(Result.err(e)),
    onSuccess: (a) => Effect.succeed(Result.ok(a)),
  })
