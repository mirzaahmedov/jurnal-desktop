import { format } from 'date-fns'

const formatLocaleDate = (date?: string) => {
  try {
    if (!date) {
      return ''
    }
    return format(new Date(date), 'dd.MM.yyyy')
  } catch {
    return ''
  }
}

const unformatLocaleDate = (date: string) => {
  const value = date.split('.').reverse().join('-')
  const dateObj = new Date(value)

  if (isNaN(dateObj.getTime())) {
    return ''
  }

  return value
}

const formatNumber = (num: number) => {
  return Intl.NumberFormat('ru-RU', {
    style: 'decimal',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(num)
}

const unformatNumber = (num: string) => {
  return Number(num.replace(/\s/g, '').replace(',', '.'))
}

export { formatLocaleDate, unformatLocaleDate, formatNumber, unformatNumber }
