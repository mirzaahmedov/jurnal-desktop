export type YearScheduleType = {
  oy_1: number
  oy_2: number
  oy_3: number
  oy_4: number
  oy_5: number
  oy_6: number
  oy_7: number
  oy_8: number
  oy_9: number
  oy_10: number
  oy_11: number
  oy_12: number
}

export const monthNames: Array<{
  name: keyof YearScheduleType
  label: string
}> = [
  { name: 'oy_1', label: 'Январь' },
  { name: 'oy_2', label: 'Февраль' },
  { name: 'oy_3', label: 'Март' },
  { name: 'oy_4', label: 'Апрель' },
  { name: 'oy_5', label: 'Май' },
  { name: 'oy_6', label: 'Июнь' },
  { name: 'oy_7', label: 'Июль' },
  { name: 'oy_8', label: 'Август' },
  { name: 'oy_9', label: 'Сентябрь' },
  { name: 'oy_10', label: 'Октябрь' },
  { name: 'oy_11', label: 'Ноябрь' },
  { name: 'oy_12', label: 'Декабрь' }
]
