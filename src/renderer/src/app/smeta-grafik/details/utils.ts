import type { SmetaGrafikProvodka } from '@/common/models'

import { t } from 'i18next'

export const calculateRowTotals = (
  row: Omit<SmetaGrafikProvodka, 'id' | 'smeta_id' | 'smeta_number' | 'smeta_name' | 'itogo'>
) => {
  const total = [
    row.oy_1,
    row.oy_2,
    row.oy_3,
    row.oy_4,
    row.oy_5,
    row.oy_6,
    row.oy_7,
    row.oy_8,
    row.oy_9,
    row.oy_10,
    row.oy_11,
    row.oy_12
  ].reduce((acc, value) => acc + (value || 0), 0)

  return total
}

export const calculateColumnTotals = (
  rows: Omit<SmetaGrafikProvodka, 'id' | 'smeta_id' | 'smeta_number' | 'smeta_name' | 'itogo'>[]
) => {
  const totals = {
    smeta_id: 0,
    smeta_number: t('total'),
    smeta_name: 'total',
    oy_1: 0,
    oy_2: 0,
    oy_3: 0,
    oy_4: 0,
    oy_5: 0,
    oy_6: 0,
    oy_7: 0,
    oy_8: 0,
    oy_9: 0,
    oy_10: 0,
    oy_11: 0,
    oy_12: 0
  } as SmetaGrafikProvodka

  rows.forEach((row) => {
    totals.oy_1 += row.oy_1 || 0
    totals.oy_2 += row.oy_2 || 0
    totals.oy_3 += row.oy_3 || 0
    totals.oy_4 += row.oy_4 || 0
    totals.oy_5 += row.oy_5 || 0
    totals.oy_6 += row.oy_6 || 0
    totals.oy_7 += row.oy_7 || 0
    totals.oy_8 += row.oy_8 || 0
    totals.oy_9 += row.oy_9 || 0
    totals.oy_10 += row.oy_10 || 0
    totals.oy_11 += row.oy_11 || 0
    totals.oy_12 += row.oy_12 || 0
  })

  return totals
}
