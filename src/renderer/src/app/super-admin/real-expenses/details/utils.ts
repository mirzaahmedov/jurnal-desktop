import type { RealExpenses } from '@renderer/common/models'

export const transformData = (childs: RealExpenses.ReportPreviewProvodka[]) => {
  const grafiksMap = new Map<number, Grafik[]>()

  childs.forEach((child) => {
    child.smeta_grafiks.forEach((grafik) => {
      if (!grafiksMap.has(grafik.id)) {
        grafiksMap.set(grafik.id, [])
      }
      grafiksMap.get(grafik.id)?.push({
        ...grafik,
        type: child.type
      })
    })
  })

  const rows: ExpensesTableRow[] = []

  grafiksMap.forEach((values) => {
    const result = {} as ExpensesTableRow

    const grafik = values[0]
    result.id = grafik.id
    result.smeta_name = grafik.smeta_name
    result.smeta_number = grafik.smeta_number.replace(/\s/g, '')

    values.forEach((item) => {
      result[`${item.type}_debet`] = item.summa.debet_sum
      result[`${item.type}_kredit`] = item.summa.kredit_sum
    })

    rows.push(result)
  })

  return rows
}

export const calculateColumnTotals = (rows: ExpensesTableRow[]) => {
  const totals = {
    start_debet: 0,
    start_kredit: 0,
    jur1_debet: 0,
    jur1_kredit: 0,
    jur2_debet: 0,
    jur2_kredit: 0,
    jur3_debet: 0,
    jur3_kredit: 0,
    jur4_debet: 0,
    jur4_kredit: 0,
    jur5_debet: 0,
    jur5_kredit: 0,
    jur6_debet: 0,
    jur6_kredit: 0,
    jur7_debet: 0,
    jur7_kredit: 0,
    jur8_debet: 0,
    jur8_kredit: 0,
    end_debet: 0,
    end_kredit: 0
  } as ExpensesTableRow
  totals.id = -1
  totals.smeta_name = 'Итого'
  totals.smeta_number = ''
  rows.forEach((row) => {
    totals.start_debet += row.start_debet
    totals.start_kredit += row.start_kredit
    totals.jur1_debet += row.jur1_debet
    totals.jur1_kredit += row.jur1_kredit
    totals.jur2_debet += row.jur2_debet
    totals.jur2_kredit += row.jur2_kredit
    totals.jur3_debet += row.jur3_debet
    totals.jur3_kredit += row.jur3_kredit
    totals.jur4_debet += row.jur4_debet
    totals.jur4_kredit += row.jur4_kredit
    totals.jur5_debet += row.jur5_debet
    totals.jur5_kredit += row.jur5_kredit
    totals.jur6_debet += row.jur6_debet
    totals.jur6_kredit += row.jur6_kredit
    totals.jur7_debet += row.jur7_debet
    totals.jur7_kredit += row.jur7_kredit
    totals.jur8_debet += row.jur8_debet
    totals.jur8_kredit += row.jur8_kredit
    totals.end_debet += row.end_debet
    totals.end_kredit += row.end_kredit
  })

  return totals
}

export const calculateRowTotals = (rows: ExpensesTableRow[]) => {
  return rows.map((row) => {
    return {
      ...row,
      itogo_debet:
        row.jur1_debet +
        row.jur2_debet +
        row.jur3_debet +
        row.jur4_debet +
        row.jur5_debet +
        row.jur6_debet +
        row.jur7_debet +
        row.jur8_debet,
      itogo_kredit:
        row.jur1_kredit +
        row.jur2_kredit +
        row.jur3_kredit +
        row.jur4_kredit +
        row.jur5_kredit +
        row.jur6_kredit +
        row.jur7_kredit +
        row.jur8_kredit
    }
  })
}

export type ExpensesTableRow = {
  id: number
  smeta_name: string
  smeta_number: string
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
  itogo: number
}

type Grafik = {
  type: string
} & RealExpenses.ReportPreviewProvodkaGrafik
