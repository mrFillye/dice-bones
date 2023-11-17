export function mapCount<T>(count: number, fn: (index: number, arr: T[]) => T) {
  const result = [] as T[]
  for (let i = 0; i < count; i++) {
    result.push(fn(i, result))
  }
  return result
}

export function mapRange<T>(
  from: number,
  to: number,
  fn: (index: number, arr: T[]) => T,
) {
  const result = [] as T[]
  for (let i = from; i <= to; i++) {
    result.push(fn(i, result))
  }
  return result
}
