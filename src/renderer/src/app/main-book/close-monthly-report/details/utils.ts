import { CloseMonthlyReportDetails, CloseMonthlyReportTableItem } from '@renderer/common/models'

interface ProvodkaItem {
  id: number
  name: string
  schet: string
  sub_schet: string
  type_schet: string
  smeta_id: number
  summa: {
    debet_sum: number
    kredit_sum: number
  }
  key: string
}

export const transformData = (data: CloseMonthlyReportDetails[]) => {
  const schetsMap = new Map<number, ProvodkaItem[]>()

  data.forEach((item) => {
    item.schets.forEach((schet) => {
      if (!schetsMap.has(schet.id)) {
        schetsMap.set(schet.id, [])
      }
      schetsMap.get(schet.id)?.push({
        ...schet,
        key: item.key
      })
    })
  })

  const rows: CloseMonthlyReportTableItem[] = []

  schetsMap.forEach((values, key) => {
    const result = {} as CloseMonthlyReportTableItem

    const schet = values[0]
    result.id = key
    result.name = schet.name
    result.schet = schet.schet
    result.sub_schet = schet.sub_schet
    result.type_schet = schet.type_schet
    result.smeta_id = schet.smeta_id

    values.forEach((item) => {
      result[`${item.key}_debet`] = item.summa.debet_sum
      result[`${item.key}_kredit`] = item.summa.kredit_sum
    })

    rows.push(result)
  })

  return rows
}
