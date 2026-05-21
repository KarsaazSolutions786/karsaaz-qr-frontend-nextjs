/**
 * Formatting Utility Functions
 * String formatting, number formatting, and conversion helpers.
 */

/**
 * Purpose: Capitalize first letter of each word
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function capitalize(str: string): string {
  return str.replace(/\b\w/g, m => m.toUpperCase())
}

/**
 * Purpose: Convert string to kebab-case
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function kebabCase(str: string, forceLowerCase = true): string {
  if (!str || (typeof str === 'string' && str.trim().length === 0)) return ''
  if (forceLowerCase) str = str.toLowerCase()
  return str.replace(/ /g, '-')
}

/**
 * Purpose: Convert string to slug
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function slugify(str: string): string {
  if (!str || (typeof str === 'string' && str.trim().length === 0)) return ''
  str = str.replace(/[[\]{}#~/.|<>,&"'?`\-=+]/g, ' ')
  str = str.replace(/\s+/g, ' ')
  return kebabCase(str)
}

/**
 * Purpose: Convert string to StudlyCase/PascalCase
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function studlyCase(str: string): string {
  return titleCase(str).replace(/ /g, '')
}

/**
 * Purpose: Convert string to Title Case
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function titleCase(str: string): string {
  return capitalize(
    str
      .replace(/-|_/g, ' ')
      .replace(/[A-Z]/g, m => ' ' + m)
      .toLowerCase()
  )
}

/**
 * Purpose: Uppercase first character
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function ucfirst(str: string): string {
  return (str[0] ?? '').toUpperCase() + str.substring(1)
}

/**
 * Purpose: Uppercase first character of each word
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function ucwords(str: string): string {
  return str.split(' ').map(ucfirst).join(' ')
}

/**
 * Purpose: Truncate string with ellipsis
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function truncate(str: string, length: number, ending = '...'): string {
  if (str.length <= length) return str
  return str.substring(0, length - ending.length) + ending
}

/**
 * Purpose: Get initials from name
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function getInitials(name: string, maxLength = 2): string {
  if (!name) return ''
  return name
    .split(' ')
    .map(part => part[0])
    .filter(Boolean)
    .slice(0, maxLength)
    .join('')
    .toUpperCase()
}

/**
 * Purpose: Format number with separators
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function numberFormat(
  number: number,
  decimals?: number,
  decimalSeparator = '.',
  thousandsSeparator = ','
): string {
  if (number == null || !isFinite(number)) {
    throw new TypeError('number is not valid')
  }

  if (!decimals) {
    const numberAfterDecimalPoint = number.toString().split('.')[1]
    if (numberAfterDecimalPoint && parseInt(numberAfterDecimalPoint)) {
      decimals = numberAfterDecimalPoint.length
    }
  }

  let formatted = parseFloat(String(number)).toFixed(decimals)
  formatted = formatted.replace('.', decimalSeparator)

  const splitNum = formatted.split(decimalSeparator)
  splitNum[0] = splitNum[0]!.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator)

  return splitNum.join(decimalSeparator)
}

/**
 * Purpose: Format bytes to human readable string
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * Purpose: Format duration in seconds to human readable string
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`
  }
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

/**
 * Purpose: Convert 2D array to CSV string
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function arrayToCsv(data: string[][]): string {
  return data
    .map(row =>
      row
        .map(String)
        .map(v => v.replaceAll('"', '""'))
        .map(v => `"${v}"`)
        .join(',')
    )
    .join('\r\n')
}
