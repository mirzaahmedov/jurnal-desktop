export const DateRegex = /^\d{1,2}.\d{1,2}.\d{4}$/
export const ISODateRegex = /^\d{4}-\d{1,2}-\d{1,2}$/

export const getFirstDayOfMonth = (date: Date = new Date()) => {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export const getLastDayOfMonth = (date: Date = new Date()) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

export const formatDate = (date: Date | string) => {
  if (!date) {
    return ''
  }
  if (typeof date === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date
    }
    date = new Date(date)
  }

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map((n) => n.toString().padStart(2, '0')).join('-')
}

export const parseDate = (date: string) => {
  if (!date?.trim()) {
    return new Date()
  }
  const [year, month, day] = date.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export const parseLocaleDate = (date: string) => {
  if (!date?.trim()) {
    return new Date()
  }
  const [day, month, year] = date.split('.').map(Number)
  return new Date(year, month - 1, day)
}

export const validateLocaleDate = (formatted: string): boolean => {
  const date = new Date(formatted.split('.').reverse().join('-'))

  const parts = formatted.split('.').map(Number)
  if (parts.length !== 3) {
    return false
  }

  const [day, month, year] = parts

  return (
    DateRegex.test(formatted) &&
    !isNaN(date.getTime()) &&
    date.getDate() === day &&
    date.getMonth() + 1 === month &&
    date.getFullYear() === year
  )
}

export const validateDate = (dateString: string): boolean => {
  if (!dateString || !ISODateRegex.test(dateString)) {
    return false
  }

  const date = new Date(dateString)

  const [year, month, day] = dateString.split('-').map(Number)

  return (
    !isNaN(date.getTime()) &&
    date.getDate() === day &&
    date.getMonth() + 1 === month &&
    date.getFullYear() === year
  )
}

export const monthNames = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december'
]

export const getMonthName = (monthNumber: number) => {
  if (monthNumber < 1 || monthNumber > 12) {
    return ''
  }
  return monthNames[monthNumber - 1]
}

export const withinMonth = (date: Date, month: Date) => {
  return date >= getFirstDayOfMonth(month) && date <= getLastDayOfMonth(month)
}

export const localeDateToISO = (localeDateString: string) => {
  return localeDateString.split('.').reverse().join('-')
}

export enum Weekday {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6
}

export interface GetDaysCountArgs {
  startDate: Date
  endDate: Date
  excludedDays?: Weekday[]
}
export const getDaysCount = ({ startDate, endDate, excludedDays = [] }: GetDaysCountArgs) => {
  let count = 0

  const current = new Date(startDate)

  while (current <= endDate) {
    const day = current.getDay()
    if (!excludedDays.includes(day)) {
      count++
    }
    current.setDate(current.getDate() + 1)
  }

  return count
}

export const calculateDateDifference = (startDate: Date, endDate: Date) => {
  if (!(startDate instanceof Date)) startDate = new Date(startDate)
  if (!(endDate instanceof Date)) endDate = new Date(endDate)

  let years = endDate.getFullYear() - startDate.getFullYear()
  let months = endDate.getMonth() - startDate.getMonth()
  let days = endDate.getDate() - startDate.getDate()

  if (days < 0) {
    months -= 1
    const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0)
    days += prevMonth.getDate()
  }

  if (months < 0) {
    years -= 1
    months += 12
  }

  return { years, months, days }
}
