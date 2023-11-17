import { describe, expect, test } from '@jest/globals'

import { cleanInputInteger } from '../cleanInputInteger'

describe('Clean number', () => {
  test('Remove extra separators', () => {
    expect(cleanInputInteger('0.2.2')).toBe('22')
  })
  test('Remove extra zeros', () => {
    expect(cleanInputInteger('00')).toBe('0')
  })
  test('Allow zero', () => {
    expect(cleanInputInteger('0')).toBe('0')
  })
  test('Remove text', () => {
    expect(cleanInputInteger('My super 234 kilo')).toBe('234')
  })
})
