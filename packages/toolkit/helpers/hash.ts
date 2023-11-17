export function sha256(value: string) {
  const utf8 = new TextEncoder().encode(value)
  return crypto.subtle.digest('SHA-256', utf8).then((hashBuffer) => {
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray
      .map((bytes) => bytes.toString(16).padStart(2, '0'))
      .join('')
    return hashHex
  })
}

export function randomSHA256() {
  const random = crypto.getRandomValues(new Uint32Array(1))[0].toString()
  return sha256(random)
}
