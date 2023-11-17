export type Err<E> = {
  _tag: 'Err'
  value: E
}

export type Ok<T> = {
  _tag: 'Ok'
  value: T
}

export type Result<T, E = string> = Ok<T> | Err<E>

export const ok = <T, E>(value: T): Result<T, E> => ({
  _tag: 'Ok',
  value,
})

export const err = <E>(value: E): Result<never, E> => ({
  _tag: 'Err',
  value,
})

export const isOk = <T, E>(result: Result<T, E>): result is Ok<T> =>
  result._tag === 'Ok'
export const isErr = <T, E>(result: Result<T, E>): result is Err<E> =>
  result._tag === 'Err'

export function map<T, E, U>(
  result: Result<T, E>,
  fn: (value: T) => U,
): Result<U, E>
export function map<T, E, U>(
  fn: (value: T) => U,
): (result: Result<T, E>) => Result<U, E>
export function map<T, E, U>(
  resultOrFn: Result<T, E> | ((value: T) => U),
  fn?: (value: T) => U,
): Result<U, E> | ((result: Result<T, E>) => Result<U, E>) {
  if (typeof resultOrFn === 'function') {
    return (result) => map(result, resultOrFn)
  }
  if (isErr(resultOrFn)) {
    return resultOrFn
  }
  return ok(fn!(resultOrFn.value))
}

export function mapErr<T, E, U>(
  result: Result<T, E>,
  fn: (value: E) => U,
): Result<T, U>
export function mapErr<T, E, U>(
  fn: (value: E) => U,
): (result: Result<T, E>) => Result<T, U>
export function mapErr<T, E, U>(
  resultOrFn: Result<T, E> | ((value: E) => U),
  fn?: (value: E) => U,
): Result<T, U> | ((result: Result<T, E>) => Result<T, U>) {
  if (typeof resultOrFn === 'function') {
    return (result) => mapErr(result, resultOrFn)
  }
  if (isOk(resultOrFn)) {
    return resultOrFn
  }
  return err(fn!(resultOrFn.value))
}

export function andThen<T, E, U>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>,
): Result<U, E>
export function andThen<T, E, U>(
  fn: (value: T) => Result<U, E>,
): (result: Result<T, E>) => Result<U, E>
export function andThen<T, E, U>(
  resultOrFn: Result<T, E> | ((value: T) => Result<U, E>),
  fn?: (value: T) => Result<U, E>,
): Result<U, E> | ((result: Result<T, E>) => Result<U, E>) {
  if (typeof resultOrFn === 'function') {
    return (result) => andThen(result, resultOrFn)
  }
  if (isErr(resultOrFn)) {
    return resultOrFn
  }
  return fn!(resultOrFn.value)
}

export function orElse<T, E, U>(
  result: Result<T, E>,
  fn: (value: E) => Result<T, U>,
): Result<T, U>
export function orElse<T, E, U>(
  fn: (value: E) => Result<T, U>,
): (result: Result<T, E>) => Result<T, U>
export function orElse<T, E, U>(
  resultOrFn: Result<T, E> | ((value: E) => Result<T, U>),
  fn?: (value: E) => Result<T, U>,
): Result<T, U> | ((result: Result<T, E>) => Result<T, U>) {
  if (typeof resultOrFn === 'function') {
    return (result) => orElse(result, resultOrFn)
  }
  if (isOk(resultOrFn)) {
    return resultOrFn
  }
  return fn!(resultOrFn.value)
}

export function unwrap<T, E>(result: Result<T, E>): T {
  if (isOk(result)) {
    return result.value
  }
  throw result.value
}

export function unwrapErr<T, E>(result: Result<T, E>): E {
  if (isOk(result)) {
    throw result.value
  }
  return result.value
}

export function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  if (isOk(result)) {
    return result.value
  }
  return defaultValue
}

export function unwrapOrElse<T, E>(result: Result<T, E>, fn: () => T): T {
  if (isOk(result)) {
    return result.value
  }
  return fn()
}

export type Pattern<T, E, OnOk, OnErr> = {
  Ok: (value: T) => OnOk
  Err: (value: E) => OnErr
}

export function match<T, E, OnOk, OnErr>(
  result: Result<T, E>,
  pattern: Pattern<T, E, OnOk, OnErr>,
): OnOk | OnErr
export function match<T, E, OnOk, OnErr>(
  pattern: Pattern<T, E, OnOk, OnErr>,
): (result: Result<T, E>) => OnOk | OnErr
export function match<T, E, OnOk, OnErr>(
  resultOrPattern: Result<T, E> | Pattern<T, E, OnOk, OnErr>,
  pattern?: Pattern<T, E, OnOk, OnErr>,
): OnErr | OnOk | ((result: Result<T, E>) => OnOk | OnErr) {
  if (arguments.length === 1) {
    const pattern = resultOrPattern as Pattern<T, E, OnOk, OnErr>
    return (result) => match(result, pattern)
  }
  const result = resultOrPattern as Result<T, E>
  if (isOk(result)) {
    return pattern!.Ok(result.value)
  }
  return pattern!.Err(result.value)
}
