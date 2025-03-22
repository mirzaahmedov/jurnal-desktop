import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { capitalize } from './string'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const cyrillic = {
  digits: ['', 'бир', 'икки', 'уч', 'тўрт', 'беш', 'олти', 'етти', 'саккиз', 'тўққиз'],
  tens: ['', 'ўн', 'йигирма', 'ўттиз', 'қирқ', 'эллик', 'олтмиш', 'етмиш', 'саксон', 'тўқсон'],
  hundred: 'юз',
  thousands: ['', 'минг', 'миллион', 'миллиард', 'триллион', 'куадриллион'],
  sum: 'сўм',
  tiyin: 'тийин'
}
const latin = {
  digits: ['', 'bir', 'ikki', 'uch', "to'rt", 'besh', 'olti', 'yetti', 'sakkiz', "to'qqiz"],
  tens: [
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
  ],
  hundred: 'yuz',
  thousands: ['', 'ming', 'million', 'milliard', 'trillion', 'kuadrillion'],
  sum: 'so‘m',
  tiyin: 'tiyin'
}

export const getDecimalPart = (value: number) => {
  return Math.round((value + Number.EPSILON) * 100) % 100
}

export const numberToWords = (num: number, locale: string, initial: boolean = true): string => {
  const resource = locale === 'uz' ? latin : cyrillic

  const { digits, tens, hundred, thousands, sum, tiyin } = resource

  if (initial) {
    const decimalPart = getDecimalPart(num)
    const integerPart = Math.floor(num)
    return capitalize(
      (numberToWords(integerPart, locale, false) || '0') +
        ' ' +
        sum +
        ' ' +
        (decimalPart % 100 || '00') +
        ' ' +
        tiyin
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

export const extendObject = <T extends Record<string, unknown>, D extends Record<string, unknown>>(
  target: T | undefined,
  data: D
): T & D => {
  if (!target) {
    return data as T & D
  }
  return Object.assign(target, data)
}

export const roundNumberToTwoDecimalPlaces = (num: number): number => {
  return Math.round(num * 100) / 100
}

export const splitStringByLength = (str: string, n: number): string[] => {
  const result: string[] = []
  for (let i = 0; i < str.length; i += n) {
    result.push(str.slice(i, i + n))
  }
  return result
}

export const mergeStyles = (...styles: any[]) => {
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

export const parseCSSNumericValue = (value: string) => {
  return parseFloat(value.replace(/[^0-9.-]/g, ''))
}

export const monthFields = [
  'oy_1',
  'oy_2',
  'oy_3',
  'oy_4',
  'oy_5',
  'oy_6',
  'oy_7',
  'oy_8',
  'oy_9',
  'oy_10',
  'oy_11',
  'oy_12'
] as const
export type MonthField = (typeof monthFields)[number]

export const calculateAnnualTotalSum = (values: Record<MonthField, number>) => {
  return monthFields.reduce((result, field) => {
    if (field in values) {
      return result + values[field]
    }
    return result
  }, 0)
}
