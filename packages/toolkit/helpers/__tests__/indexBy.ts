import { describe, expect, test } from '@jest/globals'

import { indexBy } from '../indexBy'

describe('Index by', () => {
  test('Transform', () => {
    const users = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
      { id: 3, name: 'Bob' },
    ]
    const indexedUsers = indexBy(users, 'id')
    expect(indexedUsers).toEqual({
      1: { id: 1, name: 'John' },
      2: { id: 2, name: 'Jane' },
      3: { id: 3, name: 'Bob' },
    })
  })
})
