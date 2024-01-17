import { stores } from '@sok/dice'
import { shakeStores } from '@sok/dice/api'
import { makeFakeUser } from '@sok/toolkit/helpers/makeFakeUser'
import { button, useControls } from 'leva'

import { useSocket } from './SocketProvider'

export function useDebugControls() {
  const socketApi = useSocket()
  useControls(
    'Server',
    {
      URL: 'https://dice-online-be-3adac8d6408d.herokuapp.com/',
      Path: '',
      Auth: button(() => {
        // const user = makeFakeUser()
        // stores.ui.currentUser.actions.setUser(user)
      }),
      Connect: button((get) => {
        socketApi.instantiate(get('Server.URL'), get('Server.Path'))
      }),
      Disconnect: button(() => {
        socketApi.socket?.disconnect()
      }),
    },
    [socketApi],
  )
  useControls('Start', {
    Time: {
      value: 0,
      step: 1,
      min: 0,
    },
    Play: button((get) => {
      shakeStores.fsm.actions.send({
        type: 'SHAKE',
        time: get('Start.Time') * 1000,
      })
    }),
  })
  useControls('Await', {
    'Remaining time': {
      value: 20,
      step: 1,
      min: 0,
    },
    Wait: button((get) => {
      shakeStores.fsm.actions.send({
        type: 'WAIT',
        time: get('Await.Remaining time') * 1000,
      })
    }),
  })
}
