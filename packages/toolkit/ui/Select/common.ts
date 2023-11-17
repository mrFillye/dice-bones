export const themes = {
  primary: 'primary',
} as const

export type Theme = (typeof themes)[keyof typeof themes]

export type ProviderProps = {
  disabled?: boolean
  theme?: Theme
  opened?: boolean
  active?: string
  onActiveChange?: (active: string | undefined) => void
  onOpen?: () => void
  onClose?: () => void
}
