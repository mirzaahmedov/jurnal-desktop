import type { OdinoxTableRow } from './interfaces'
import type { OdinoxProvodka } from '@/common/models'

export const defaultValues = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  childs: [] as OdinoxProvodka[],
  rows: [] as OdinoxTableRow[]
}

export type OdinoxFormValues = typeof defaultValues
