import { NextRequest, NextResponse } from 'next/server'

import { compareTokens } from './auth-config'

const getPage = (pathname: string) => {
  return pathname.replace('/demos/', '')
}

export default async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/demos')) {
    const page = getPage(request.nextUrl.pathname)
    const [catalog] = page.split('/')

    if (catalog.length === 0) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.rewrite(url)
    }

    const authToken = request.cookies.get('auth-token')
    if (compareTokens(catalog, authToken?.value)) {
      return NextResponse.next()
    }

    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}
