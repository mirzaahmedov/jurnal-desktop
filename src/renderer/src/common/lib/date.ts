const date_regex = /^\d{1,2}.\d{1,2}.\d{4}$/

const getFirstDayOfMonth = (date: Date = new Date()) => {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

const getLastDayOfMonth = (date: Date = new Date()) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

const formatDate = (date: Date | string) => {
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

const parseDate = (date: string) => {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(year, month - 1, day)
}

const validateLocaleDate = (formatted: string): boolean => {
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

export { getFirstDayOfMonth, getLastDayOfMonth, formatDate, parseDate, validateLocaleDate }
