import type { Mainbook } from '@renderer/common/models'

export const transformData = (schets: Mainbook.ReportPreviewProvodka[]) => {
  const schetsMap = new Map<number, Schet[]>()

  schets.forEach((item) => {
    item.schets.forEach((schet) => {
      if (!schetsMap.has(schet.id)) {
        schetsMap.set(schet.id, [])
      }
      schetsMap.get(schet.id)?.push({
        ...schet,
        type: item.type
      })
    })
  })

  const rows: MainbookTableRow[] = []

  schetsMap.forEach((values) => {
    const result = {} as MainbookTableRow

    const schet = values[0]
    result.id = schet.id
    result.name = schet.name
    result.schet = schet.schet

    values.forEach((item) => {
      result[`${item.type}_debet`] = item.summa.debet_sum
      result[`${item.type}_kredit`] = item.summa.kredit_sum
    })

    rows.push(result)
  })

  return rows
}

export type MainbookTableRow = {
  id: number
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

type Schet = {
  type: string
} & Mainbook.ReportPreviewProvodka['schets'][number]
