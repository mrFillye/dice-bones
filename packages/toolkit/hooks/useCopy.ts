import { useEffect, useState } from 'react'

import { delay } from '../helpers/delay'

export type CopyState = 'none' | 'copied' | 'copying'
export function useCopy(text: string, delayMs = 1000) {
  const [copied, setCopied] = useState<CopyState>('none')

  useEffect(() => {
    let active = true
    if (copied === 'copying') {
      const copyToClipboard = async () => {
        try {
          await navigator.clipboard.writeText(text)
          if (active) {
            setCopied('copied')
          }
        } catch (err) {
          setCopied('none')
        }
      }
      copyToClipboard()
    }
    if (copied === 'copied') {
      delay(delayMs).then(() => {
        if (active) {
          setCopied('none')
        }
      })
    }
    return () => {
      active = false
    }
  }, [copied, delayMs, text])

  return [copied, () => setCopied('copying')] as const
}
