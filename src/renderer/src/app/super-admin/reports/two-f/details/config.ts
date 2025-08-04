import type { TwoFTableRow } from './interfaces'

export const defaultValues = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  title: '',
  title_summa: 0,
  title_rasxod_summa: 0,
  summa_from: 0,
  summa_to: 0,
  childs: [] as TwoFTableRow[]
}

export type TwoFFormValues = typeof defaultValues
