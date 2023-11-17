import * as _events from './events'

export type UsersEvent = ValueOf<typeof _events.users>
export type HistoryEvent = ValueOf<typeof _events.history>
export type SnapshotEvent = ValueOf<typeof _events.snapshot>
export type StateEvent = ValueOf<typeof _events.state>

export type WsEvent = UsersEvent | HistoryEvent | SnapshotEvent | StateEvent

function createWithNamespace() {
  const result = {} as typeof _events
  for (const [namespace, value] of Object.entries(_events)) {
    const withNamespace = {} as any
    for (const [varName, eventName] of Object.entries(value)) {
      withNamespace[varName] = `${namespace}:${eventName}`
    }
    result[namespace as keyof typeof result] = withNamespace
  }

  return result
}

export const socketEvents = createWithNamespace()
