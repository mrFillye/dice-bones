export function isKey<T extends {}>(
  key: string | number | symbol | null | undefined,
  obj: T,
): key is keyof T {
  if (key === null || key === undefined) {
    return false
  }

  return key in obj
}
