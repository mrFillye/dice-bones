export function indexBy<T extends { [key: string]: any }>(
  list: T[],
  key: keyof T,
) {
  return list.reduce(
    (acc, item) => {
      acc[item[key]] = item
      return acc
    },
    {} as Record<string, T>,
  )
}
