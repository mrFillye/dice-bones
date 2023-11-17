export const themes = {
  primary: 'primary',
} as const

export const types = {
  text: 'text',
  password: 'password',
  number: 'number',
  htmlNumber: 'htmlNumber',
  email: 'email',
  integer: 'integer',
} as const

export const gapColumnsSizes = {
  none: 'none',
  small: 'small',
  medium: 'medium',
} as const

export type Theme = (typeof themes)[keyof typeof themes]
export type Type = (typeof types)[keyof typeof types]
export type GapColumns = (typeof gapColumnsSizes)[keyof typeof gapColumnsSizes]
