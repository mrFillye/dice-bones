import { random } from './random'

export const makeFakeUser = () => {
  const randomId = random.int(0, 8000)
  return {
    id: String(randomId),
    state: 'idle',
    name: random.name(),
    avatar: `/assets/avatar-placeholders/Image-${randomId % 31}.png`,
  } as const
}
