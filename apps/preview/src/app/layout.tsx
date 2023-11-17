'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import cx from 'classnames'
import { Inter } from 'next/font/google'
import { Flowbite } from '~/flowbite'

import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })
const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <Flowbite>
          <body
            className={cx('bg-slate-900 text-gray-200 dark', inter.className)}
          >
            {children}
          </body>
        </Flowbite>
      </html>
    </QueryClientProvider>
  )
}
