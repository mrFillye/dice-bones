export function shallow<T extends {}>(
  obj1: T | undefined,
  obj2: T | undefined,
): boolean {
  if (obj1 === obj2) {
    return true
  }

  if (!obj1 || !obj2) {
    return false
  }

  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false
  }

  for (let key in obj1) {
    if (obj1[key] !== obj2[key]) {
      return false
    }
  }

  return true
}
