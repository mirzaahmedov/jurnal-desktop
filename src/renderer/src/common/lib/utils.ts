import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const digits = ['', 'bir', 'ikki', 'uch', "to'rt", 'besh', 'olti', 'yetti', 'sakkiz', "to'qqiz"]
const tens = [
  '',
  "o'n",
  'yigirma',
  "o'ttiz",
  'qirq',
  'ellik',
  'oltmish',
  'yetmish',
  'sakson',
  "to'qson"
]
const hundred = 'yuz'
const thousands = ['', 'ming', 'million', 'milliard', 'trillion', 'kuadrillion']

const getDecimalPart = (value: number) => {
  return Math.round((value + Number.EPSILON) * 100) % 100
}

const capitalize = (str: string): string => {
  if (!str || typeof str !== 'string') {
    return ''
  }
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const numberToWords = (num: number, initial: boolean = true): string => {
  if (initial) {
    const decimalPart = getDecimalPart(num)
    const integerPart = Math.floor(num)
    return capitalize(
      (numberToWords(integerPart, false) || '0') +
        ' ' +
        'so`m' +
        ' ' +
        (decimalPart % 100 || '00') +
        ' ' +
        'tiyin'
    )
  }

  const helper = (n: number): string => {
    const results: string[] = []

    const hundersDigit = Math.floor(n / 100)
    const tensDigit = Math.floor((n % 100) / 10)
    const onesDigit = n % 10

    if (hundersDigit !== 0) {
      results.push(digits[hundersDigit], hundred)
    }
    if (tensDigit !== 0) {
      results.push(tens[tensDigit])
    }
    if (onesDigit !== 0) {
      results.push(digits[onesDigit])
    }

    return results.filter((value) => value).join(' ')
  }

  const results: string[] = []

  let i = 0
  while (num > 0) {
    const rem = num % 1000
    if (rem !== 0) {
      let result = helper(rem)
      if (i !== 0) {
        result += ' ' + thousands[i]
      }
      results.unshift(result)
    }
    num = Math.floor(num / 1000)
    i++
  }

  return results.join(' ')
}

const extendObject = <T extends Record<string, unknown>, D extends Record<string, unknown>>(
  target: T | undefined,
  data: D
): T & D => {
  if (!target) {
    return data as T & D
  }
  return Object.assign(target, data)
}

const roundNumberToTwoDecimalPlaces = (num: number): number => {
  return Math.round((num + Number.EPSILON) * 100) / 100
}

const splitStringByLength = (str: string, n: number): string[] => {
  const result: string[] = []
  for (let i = 0; i < str.length; i += n) {
    result.push(str.slice(i, i + n))
  }
  return result
}

const mergeStyles = (...styles: any[]) => {
  return styles.reduce((acc, style) => {
    if (!style) {
      return acc
    }

    if (Array.isArray(style)) {
      return mergeStyles(acc, ...style)
    }

    return Object.assign(acc, style)
  }, {})
}

const parseCSSNumericValue = (value: string) => {
  return parseFloat(value.replace(/[^0-9.-]/g, ''))
}

export {
  mergeStyles,
  numberToWords,
  capitalize,
  getDecimalPart,
  extendObject,
  roundNumberToTwoDecimalPlaces,
  splitStringByLength,
  parseCSSNumericValue
}
