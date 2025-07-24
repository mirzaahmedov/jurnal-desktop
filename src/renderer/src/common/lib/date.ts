export const DATE_REGEX = /^\d{1,2}.\d{1,2}.\d{4}$/
export const ISO_DATE_REGEX = /^\d{4}-\d{1,2}-\d{1,2}$/
export const WORKHOURS_PER_DAY = 8

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
    DATE_REGEX.test(formatted) &&
    !isNaN(date.getTime()) &&
    date.getDate() === day &&
    date.getMonth() + 1 === month &&
    date.getFullYear() === year
  )
}

export const validateDate = (dateString: string): boolean => {
  if (!dateString || !ISO_DATE_REGEX.test(dateString)) {
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

export interface DateDiff {
  years: number
  months: number
  days: number
}
export const getDateDifference = (startDate: Date, endDate: Date): DateDiff => {
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

  return {
    years,
    months,
    days
  }
}

export interface WorkStats {
  totalDays: number
  workdays: number
  workhours: number
  weekends: number
}

export const getWorkdaysInPeriod = (
  startDate: Date,
  endDate: Date,
  workWeek: number = 5
): WorkStats => {
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
  let workdays = 0

  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate() + i
    )
    const dayOfWeek = currentDate.getDay()

    if (
      (workWeek === 5 && dayOfWeek !== Weekday.Sunday && dayOfWeek !== Weekday.Saturday) ||
      (workWeek === 6 && dayOfWeek !== Weekday.Sunday) ||
      workWeek === 7
    ) {
      workdays++
    }
  }

  return {
    totalDays,
    workdays,
    workhours: workdays * WORKHOURS_PER_DAY,
    weekends: totalDays - workdays
  }
}

export const getWorkdaysInMonth = (
  year: number,
  month: number,
  workWeek: number = 5
): WorkStats => {
  const totalDays = new Date(year, month, 0).getDate()
  let workdays = 0

  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(year, month - 1, day)
    const dayOfWeek = date.getDay()

    if (
      (workWeek === 5 && dayOfWeek !== 0 && dayOfWeek !== 6) ||
      (workWeek === 6 && dayOfWeek !== 0) ||
      workWeek === 7
    ) {
      workdays++
    }
  }

  return {
    totalDays,
    workdays,
    workhours: workdays * WORKHOURS_PER_DAY,
    weekends: totalDays - workdays
  }
}
