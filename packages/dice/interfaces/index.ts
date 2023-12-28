export interface IUser {
  id: string
  name: string
  balance: string
  state: 'idle' | 'lost' | 'win'
}
