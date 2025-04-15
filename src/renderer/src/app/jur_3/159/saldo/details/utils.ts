import type { OrganSaldoProvodkaFormValues } from '../config'

export const calculateTotal = (rows: OrganSaldoProvodkaFormValues[], skipTotal = false) => {
  return rows.reduce(
    (result, row, index) => {
      return skipTotal && index === rows.length - 1
        ? result
        : {
            prixod: result.prixod + Number(row.prixod),
            rasxod: result.rasxod + Number(row.rasxod)
          }
    },
    { prixod: 0, rasxod: 0 }
  )
}
