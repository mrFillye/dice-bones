export const names = [
  'John Doe',
  'Xavier',
  'Mia',
  'Tina Turner',
  'Mick Jagger',
  'Elvis Presley',
  'Michael Jackson',
  'Bruce Lee',
  'Willis',
  'frodo',
  't3ext',
  'yolo443',
]

export const random = {
  int: (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  },
  float: (min: number, max: number) => {
    return Math.random() * (max - min) + min
  },
  name: () => {
    return names[random.int(0, names.length - 1)]
  },
  bool: () => {
    return Math.random() >= 0.5
  },
  choose: <T>(array: T[]) => {
    return array[random.int(0, array.length - 1)]
  },
}
