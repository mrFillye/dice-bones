export function assoc<T, K extends keyof T>(obj: T, key: K, value: T[K]): T {
  return { ...obj, [key]: value }
}

export function dissoc<T, K extends keyof T>(obj: T, key: K): Omit<T, K> {
  const { [key]: _, ...rest } = obj
  return rest
}

export function assocPath<T, K extends keyof T>(
  obj: T,
  path: K[],
  value: T[K],
): T {
  if (path.length === 0) {
    return value as any
  } else {
    return path.reduceRight((acc, key) => assoc(acc, key, value), obj)
  }
}
