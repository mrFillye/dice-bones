import { NextResponse } from 'next/server'
import { z } from 'zod'
import { AuthPage, authConfig } from '~/auth-config'

const pages = Object.keys(authConfig.passwords)
const schema = z.object({
  password: z.string(),
  page: z.string().refine((page) => pages.includes(page), {
    message: `Page must be one of: ${pages.join(', ')}`,
  }) as z.ZodEffects<z.ZodString, AuthPage, string>,
})

const TOKEN_AGE = 60 * 60 * 24 * 30

export async function POST(req: Request) {
  const result = await schema.safeParseAsync(await req.json())
  if (result.success) {
    const password = authConfig.passwords[result.data.page]
    if (result.data.password === password) {
      const res = new NextResponse('{}')
      const token = authConfig.tokens[result.data.page]
      res.cookies.set('auth-token', token, {
        maxAge: TOKEN_AGE,
      })
      return res
    } else {
      return new Response('Incorrect password', {
        status: 400,
      })
    }
  } else {
    return new Response(result.error.message, {
      status: 400,
    })
  }
}
