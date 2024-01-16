import { Half } from '@sok/game-common'
import { indexBy } from '@sok/toolkit/helpers/indexBy'
import { makeFakeUser } from '@sok/toolkit/helpers/makeFakeUser'
import { mapCount } from '@sok/toolkit/helpers/mapRange'
import { random } from '@sok/toolkit/helpers/random'
import { action, computed, observable } from 'mobx'
import { computedFn } from 'mobx-utils'

export type Participant = {
  id: string
  name: string
  avatar: string
  state: 'idle' | 'lost' | 'win'
  bet: {
    currency: 'USD' | 'EUR'
    value: number
    half: Half
  }
  wonAmount?: number
}

export type Bet = {
  autoCashout: number
  amount: number
}

const model = observable({
  participants: new Map<string, Participant>(
    Object.entries(indexBy(createFakeParticipants(1000), 'id')),
  ),
})

const getParticipant = computedFn((id: string | undefined) => {
  if (typeof id === 'undefined') {
    return undefined
  }
  return model.participants.get(id)
})

export const participants = {
  model,
  actions: {
    clear: action(() => {
      model.participants.clear()
    }),
    put: action((participant: Participant | Participant[]) => {
      if (Array.isArray(participant)) {
        participant.forEach((p) => {
          model.participants.set(p.id, p)
        })
        return
      }
      model.participants.set(participant.id, participant)
    }),
    remove: action((id: string) => {
      model.participants.delete(id)
    }),
    markRestAsLost: action(() => {
      model.participants.forEach((p) => {
        if (p.state === 'idle') {
          p.state = 'lost'
        }
      })
    }),
  },
  computes: {
    participantsList: computedFn((limit: number) => {
      const list = []
      for (const participant of model.participants.values()) {
        if (list.length >= limit) {
          break
        }
        list.push(participant)
      }
      return list
    }),
    participantsListWithUser: computedFn((limit?: number, id?: string) => {
      const necessaryUser = getParticipant(id)

      const list = []
      if (necessaryUser) {
        list.push(necessaryUser)
      }

      for (const participant of model.participants.values()) {
        if (limit && list.length >= limit) {
          break
        }
        if (participant.id !== id) {
          list.push(participant)
        }
      }
      return list
    }),
    bank: computed(() => {
      let bank = 0
      for (const participant of model.participants.values()) {
        bank += participant.bet.value
      }
      return bank
    }),
    participant: getParticipant,
    participantsCount: computed(() => {
      return model.participants.size
    }),
  },
}

export function makeFakeParticipant(
  state = random.choose<'idle' | 'lost' | 'win'>(['idle', 'lost', 'win']),
): Participant {
  const user = makeFakeUser()
  return {
    ...user,
    state,
    bet: {
      currency: 'USD',
      value: random.int(100, 4000),
      half: 'first',
    },
  }
}

export function createFakeParticipants(amount: number): Participant[] {
  return mapCount(amount, () => makeFakeParticipant())
}
