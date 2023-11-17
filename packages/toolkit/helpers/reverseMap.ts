export function reverseMap<T, R>(
  arr: T[],
  fn: (item: T, index: number, arr: T[]) => R,
) {
  const result: R[] = []
  for (let i = arr.length - 1; i >= 0; i--) {
    result.push(fn(arr[i], i, arr))
  }
  return result
}
