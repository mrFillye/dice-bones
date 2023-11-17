const passwords = {
  'dice-online': 'dice-bones',
} as const

export type AuthPage = keyof typeof passwords

export const tokens: Record<AuthPage, string> = {
  'dice-online': 'a1b2)c3d4e5f6g$7h8i9j0k1l2m3n4o%5p6q7r8s9t0u1v2w3x4y5z6',
}

export function isPage(page: string | undefined): page is AuthPage {
  return page ? page in passwords : false
}

export function compareTokens(
  page: string | undefined,
  token: string | undefined,
) {
  if (process.env.NEXT_PUBLIC_PROTECTION === 'false') {
    if (!isPage(page)) {
      console.warn('PAGE HAVE NO PROTECTION:', page)
    }
    return true
  }
  return isPage(page) && token === tokens[page]
}

export const authConfig = {
  passwords,
  tokens,
}
