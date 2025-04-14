import type { OrganSaldoProvodkaFormValues } from '../config'

export const calculateTotal = (rows: OrganSaldoProvodkaFormValues[]) => {
  return rows.reduce(
    (result, row) => {
      return {
        prixod: result.prixod + Number(row.prixod),
        rasxod: result.rasxod + Number(row.rasxod)
      }
    },
    { prixod: 0, rasxod: 0 }
  )
}
