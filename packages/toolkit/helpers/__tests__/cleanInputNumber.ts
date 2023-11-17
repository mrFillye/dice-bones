import { describe, expect, test } from '@jest/globals'

import { cleanInputNumber } from '../cleanInputNumber'

describe('Clean number', () => {
  test('Remove extra separators', () => {
    expect(cleanInputNumber('0.2.2')).toBe('0.22')
  })
  test('Replace coma to point', () => {
    expect(cleanInputNumber('0,2')).toBe('0.2')
  })
  test('Remove extra zeros at start', () => {
    expect(cleanInputNumber('04,2')).toBe('4.2')
  })
  test('Take only numbers', () => {
    expect(cleanInputNumber('Hello : 04,2 < is 0.5')).toBe('4.205')
  })
  test('Zero only', () => {
    expect(cleanInputNumber('0')).toBe('0')
  })
  test('Zero as 0.0', () => {
    expect(cleanInputNumber('0.0')).toBe('0.0')
  })
  test('Zero as 0.', () => {
    expect(cleanInputNumber('0.')).toBe('0.')
  })
})
