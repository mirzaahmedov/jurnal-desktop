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
  { name: 'oy_1', label: 'january' },
  { name: 'oy_2', label: 'february' },
  { name: 'oy_3', label: 'march' },
  { name: 'oy_4', label: 'april' },
  { name: 'oy_5', label: 'may' },
  { name: 'oy_6', label: 'june' },
  { name: 'oy_7', label: 'july' },
  { name: 'oy_8', label: 'august' },
  { name: 'oy_9', label: 'september' },
  { name: 'oy_10', label: 'october' },
  { name: 'oy_11', label: 'november' },
  { name: 'oy_12', label: 'december' }
]
