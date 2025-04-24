import type { OdinoxTableRow } from './interfaces'

export const defaultValues = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  childs: [] as OdinoxTableRow[]
}

export type OdinoxFormValues = typeof defaultValues
