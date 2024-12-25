import {
  CompleteMonthlyReportProvodka,
  CompleteMonthlyReportSchet,
  CompleteMonthlyReportTableItem
} from '@renderer/common/models'

export const transformData = (data: CompleteMonthlyReportProvodka[]) => {
  const schetsMap = new Map<string, (CompleteMonthlyReportSchet & { type: string })[]>()

  data.forEach((item) => {
    item.schets.forEach((schet) => {
      schet = normalizeSchets(schet)
      if (!schetsMap.has(schet.schet)) {
        schetsMap.set(schet.schet, [])
      }
      schetsMap.get(schet.schet)?.push({
        ...schet,
        type: item.type
      })
    })
  })

  const rows: CompleteMonthlyReportTableItem[] = []

  schetsMap.forEach((values, key) => {
    const result = {} as CompleteMonthlyReportTableItem

    const schet = values[0]
    result.id = key + schet.type
    result.name = schet.schet_name
    result.schet = schet.schet

    values.forEach((item) => {
      result[`${item.type}_debet`] = item.debet_sum
      result[`${item.type}_kredit`] = item.kredit_sum
    })

    rows.push(result)
  })

  return rows
}

type SchetFromInfo = {
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
}

export type SchetFromId = {
  spravochnik_operatsii_id: number
  schet_name: string
  schet: string
  debet_sum: number
  kredit_sum: number
}

const normalizeSchets = (schet: SchetFromInfo | SchetFromId): CompleteMonthlyReportSchet => {
  if ('id' in schet) {
    return {
      spravochnik_operatsii_id: schet.id,
      schet_name: schet.name,
      schet: schet.schet,
      debet_sum: schet.summa.debet_sum,
      kredit_sum: schet.summa.kredit_sum
    }
  }

  return {
    spravochnik_operatsii_id: schet.spravochnik_operatsii_id,
    schet_name: schet.schet_name,
    schet: schet.schet,
    debet_sum: schet.debet_sum,
    kredit_sum: schet.kredit_sum
  }
}
