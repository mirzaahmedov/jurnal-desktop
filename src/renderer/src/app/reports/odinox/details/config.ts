import type { OdinoxTableRow } from './interfaces'
import type { OdinoxProvodka } from '@/common/models'

export const defaultValues = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  title: '',
  title_summa: 0,
  summa_from: 0,
  summa_to: 0,
  title_rasxod_summa: 0,
  childs: [] as OdinoxProvodka[],
  rows: [] as OdinoxTableRow[]
}

export type OdinoxFormValues = typeof defaultValues
