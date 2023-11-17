import { logger } from '@sok/toolkit/helpers/logger'
import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'
import { Socket, io } from 'socket.io-client'

export type SocketContextApi = {
  instantiate: (uri: string, path: string) => Socket
  socket?: Socket
}

const context = createContext<SocketContextApi>({
  instantiate: (uri: string) => io(uri),
})

export const useSocket = () => useContext(context)

export type Props = PropsWithChildren<{}>
export const SocketProvider = (props: Props) => {
  const [socket, setSocket] = useState<Socket>()
  const api = useMemo<SocketContextApi>(
    () => ({
      instantiate: (uri: string, path: string) => {
        if (socket) {
          socket.disconnect()
        }
        const options = path.length > 0 ? { path } : undefined
        logger.info('Connecting...', { uri, options })
        const newSocket = io(uri, options)
        setSocket(newSocket)
        return newSocket
      },
      socket,
    }),
    [socket],
  )

  return <context.Provider value={api}>{props.children}</context.Provider>
}
