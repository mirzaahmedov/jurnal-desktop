export const date_regex = /^\d{1,2}.\d{1,2}.\d{4}$/
export const date_iso_regex = /^\d{4}-\d{1,2}-\d{1,2}$/

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
    date = new Date(date)
  }

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map((n) => n.toString().padStart(2, '0')).join('-')
}

export const parseDate = (date: string) => {
  const [year, month, day] = date.split('-').map(Number)
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
    date_regex.test(formatted) &&
    !isNaN(date.getTime()) &&
    date.getDate() === day &&
    date.getMonth() + 1 === month &&
    date.getFullYear() === year
  )
}

export const validateDate = (dateString: string): boolean => {
  if (!dateString || !date_iso_regex.test(dateString)) {
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

export const getMonthName = (monthNumber: number) => {
  if (monthNumber < 1 || monthNumber > 12) {
    return ''
  }
  return [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь'
  ][monthNumber - 1]
}

export const withinMonth = (date: Date, month: Date) => {
  return date >= getFirstDayOfMonth(month) && date <= getLastDayOfMonth(month)
}

export const localeDateToISO = (localeDateString: string) => {
  return localeDateString.split('.').reverse().join('-')
}
