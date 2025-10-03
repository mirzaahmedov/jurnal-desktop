import type { PodotchetSaldoProvodkaFormValues } from '../config'

export const calculateTotal = (rows: PodotchetSaldoProvodkaFormValues[]) => {
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
