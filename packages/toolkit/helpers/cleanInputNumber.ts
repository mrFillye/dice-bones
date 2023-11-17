const allowSeparators = [',', '.']
export function findFirstSeparatorIndex(value: string) {
  for (let index = 0; index < value.length; index++) {
    const symbol = value[index]
    if (allowSeparators.includes(symbol)) {
      return index
    }
  }
  return undefined
}

/**
 * function removes all non-numeric and number separators - `,` and `.` characters from string
 * also removes all leading zeros and extra separators with only one `,` or `.` character
 * example:
 * 1.235 // correct
 * 1,235 // correct
 * 1.235.235 // incorrect
 * 1,235,235 // incorrect
 * 1,235.235 // incorrect
 */
export function cleanInputNumber(value: string) {
  // Remove all non-numeric characters except comma and dot
  const cleaned = value.replace(/[^0-9,.]/g, '')

  if ('0' === cleaned) {
    return cleaned
  }

  // Remove leading zeros and extra separators
  const trimmed = cleaned.replace(/^0+(?!\b)/, '').replace(/(,|\.){2,}/g, '$1')

  const separatorIndex = findFirstSeparatorIndex(trimmed)
  if (separatorIndex === undefined) {
    return trimmed
  } else {
    const beforeSeparator = trimmed.slice(0, separatorIndex)
    const afterSeparator = trimmed.slice(separatorIndex + 1)
    const cleanedBeforeSeparator = beforeSeparator.replace(/[,.]/g, '')
    const cleanedAfterSeparator = afterSeparator.replace(/[,.]/g, '')
    return `${
      cleanedBeforeSeparator.length === 0 ? '0' : cleanedBeforeSeparator
    }.${cleanedAfterSeparator}`
  }
}
