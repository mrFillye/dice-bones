/**
 * function clean number and make it integer
 * 0 // correct
 * 1 // correct
 * 1.235 // incorrect
 * 1,235 // incorrect
 */
export function cleanInputInteger(value: string) {
  // Remove all non-numeric characters except comma and dot
  const cleaned = value.replace(/[^0-9]/g, '')

  return cleaned.replace(/^0+(?!\b)/, '')
}
