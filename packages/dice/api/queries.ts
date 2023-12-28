import { instance } from './index'

export const initUser = async (params: {
  id: string
  name: string
  balance: string
}) => {
  try {
    const res = await instance.get('init', { params })
    return res?.data
  } catch (error) {
    console.log('error')
  }
}
