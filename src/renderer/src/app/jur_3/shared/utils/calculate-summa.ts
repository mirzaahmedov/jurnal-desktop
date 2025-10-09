import type { OrganSaldoProvodka } from '@/common/models'

export const calculateSumma = (rows: Pick<OrganSaldoProvodka, 'prixod' | 'rasxod'>[]) => {
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
