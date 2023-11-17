/**
 * Debug levels:
  0 - full debug
  1 - logging
  2 - info
  3 - warn + errors
  4 - silent
 */
const DEBUG_LEVEL = Number(process.env.NEXT_PUBLIC_DEBUG_LEVEL ?? 2)

function getFormattedDateTime() {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const milliseconds = date.getMilliseconds()

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`
}

function getCodeLine() {
  const error = new Error()
  const stack = error.stack
  const line = stack?.split('\n')[3]
  const lineParts = line?.split(':')
  if (!lineParts) {
    return ''
  }
  const lineNum = lineParts[lineParts.length - 2]
  const fileOriginalPath = lineParts[lineParts.length - 3]
  const indexBeforeRealPath = findIndexBeforePath(fileOriginalPath)
  const filePath = fileOriginalPath.slice(indexBeforeRealPath)
  return `${filePath}:${lineNum}`
}

export const logger = {
  debug: (...args: any[]) => {
    if (DEBUG_LEVEL > 0) {
      return
    }
    return console.log(
      `%cDEBUG ${getFormattedDateTime()}:`,
      'color: #626262;',
      ...args,
      `[${getCodeLine()}]`,
    )
  },
  log: (...args: any[]) => {
    if (DEBUG_LEVEL > 1) {
      return
    }
    return console.log(
      `%cLOG ${getFormattedDateTime()}:`,
      'color: #8d60b9;',
      ...args,
      `[${getCodeLine()}]`,
    )
  },
  info: (...args: any[]) => {
    if (DEBUG_LEVEL > 2) {
      return
    }
    return console.log(
      `%cINFO ${getFormattedDateTime()}:`,
      'color: #5ba7da;',
      ...args,
      `[${getCodeLine()}]`,
    )
  },
  warn: (...args: any[]) => {
    if (DEBUG_LEVEL > 3) {
      return
    }
    return console.log(
      `%cWARN ${getFormattedDateTime()}:`,
      'color: #da9d5b;',
      ...args,
      `[${getCodeLine()}]`,
    )
  },
  error: (...args: any[]) => {
    if (DEBUG_LEVEL > 3) {
      return
    }
    return console.log(
      `%cERROR ${getFormattedDateTime()}:`,
      'color: #da5b5b;',
      ...args,
      `[${getCodeLine()}]`,
    )
  },
}

function findIndexBeforePath(fileOriginalPath: string) {
  const packagesIndex = fileOriginalPath.indexOf('packages')
  if (packagesIndex === -1) {
    const appsIndex = fileOriginalPath.indexOf('apps')
    if (appsIndex === -1) {
      return 0
    } else {
      return appsIndex
    }
  }
  return packagesIndex
}
