import type { RealCostProvodka } from '@/common/models'

export const defaultValues = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  childs: [] as RealCostProvodka[]
}

export type OdinoxFormValues = typeof defaultValues
