import type {
  CompleteMonthlyReportById,
  CompleteMonthlyReportInfo,
  SchetById,
  SchetInfo
} from '@renderer/common/models'

type NormalizedSchet = SchetById & { type: string }

export const transformData = (data: CompleteMonthlyReportInfo | CompleteMonthlyReportById) => {
  const schets = Array.isArray(data)
    ? data.map((item) => {
        const normalized = item.schets.map(normalizeSchets)
        return {
          ...item,
          schets: normalized
        }
      })
    : data.data

  const schetsMap = new Map<number, NormalizedSchet[]>()

  schets.forEach((item) => {
    item.schets.forEach((schet) => {
      if (!schetsMap.has(schet.spravochnik_operatsii_id)) {
        schetsMap.set(schet.spravochnik_operatsii_id, [])
      }
      schetsMap.get(schet.spravochnik_operatsii_id)?.push({
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
      result[`${item.type}_debet`] = item.summa.debet_sum
      result[`${item.type}_kredit`] = item.summa.kredit_sum
    })

    rows.push(result)
  })

  return rows
}

const normalizeSchets = (schet: SchetInfo): SchetById => {
  return {
    spravochnik_operatsii_id: schet.id,
    schet_name: schet.name,
    schet: schet.schet,
    summa: {
      debet_sum: schet.summa.debet_sum,
      kredit_sum: schet.summa.kredit_sum
    }
  }
}

export interface CompleteMonthlyReportTableItem {
  id: string
  name: string
  schet: string
  start_debet: number
  start_kredit: number
  jur1_debet: number
  jur1_kredit: number
  jur2_debet: number
  jur2_kredit: number
  jur3_debet: number
  jur3_kredit: number
  jur4_debet: number
  jur4_kredit: number
  jur5_debet: number
  jur5_kredit: number
  jur6_debet: number
  jur6_kredit: number
  jur7_debet: number
  jur7_kredit: number
  jur8_debet: number
  jur8_kredit: number
  end_debet: number
  end_kredit: number
}
