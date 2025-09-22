import type { PodotchetSaldoProvodkaFormValues } from '../config'

export const getProvodkaTotal = (rows: PodotchetSaldoProvodkaFormValues[]) => {
  return rows.reduce(
    (result, row) => ({
      prixod: result.prixod + Number(row.prixod),
      rasxod: result.rasxod + Number(row.rasxod)
    }),
    { prixod: 0, rasxod: 0 }
  )
}
