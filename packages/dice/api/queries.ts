import { instance } from './index'

export interface IParticipant {
  betValue: number
  half: string
  createdAt: string
  id: string
  currency: string
  wonAmount: string
  userId: string
  state: string
}

export const initUser = async (params: {
  id: string
  name: string
  balance: string
}) => {
  try {
    const res = await instance.get('init', { params })
    return res?.data
  } catch (error) {
    console.log('error', error)
  }
}

export const getParticipantHistory = async (page: number) => {
  try {
    const res = await instance.get('participant', { params: { page } })

    return res?.data
  } catch (error) {
    console.log('error', error)
  }
}
