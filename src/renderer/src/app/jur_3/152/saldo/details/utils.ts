import type { OrganSaldoProvodkaFormValues } from '../config'

export const calculateTotal = (rows: OrganSaldoProvodkaFormValues[]) => {
  return rows.reduce(
    (result, row, index) => {
      return index === rows.length - 1
        ? result
        : {
            prixod: result.prixod + Number(row.prixod),
            rasxod: result.rasxod + Number(row.rasxod)
          }
    },
    { prixod: 0, rasxod: 0 }
  )
}
