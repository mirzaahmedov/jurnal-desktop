import type { RealCostGrafik, RealCostProvodka } from '@/common/models'

export interface OdinoxAutoFillSubChild {
  id: number
  smeta_name: string
  smeta_number: string
  group_number: string
  smeta_id: number
  summa: number
}
export interface OdinoxAutoFill {
  id: number
  name: string
  sort_order: number
  created_at: string
  updated_at: string
  is_deleted: boolean
  type_id: number
  sub_childs: OdinoxAutoFillSubChild[]
  summa: number
}

type RealCostMonthGrafik = Pick<
  RealCostGrafik,
  'doc_num' | 'doc_date' | 'name' | 'rasxod_summa' | 'remaining_summa' | 'contract_grafik_summa'
> & {
  grafik_id?: number
}
type RealCostYearGrafik = {
  [key in keyof RealCostMonthGrafik as `${key}_year`]: RealCostMonthGrafik[key]
}

export interface RealCostTableRow
  extends Pick<
      RealCostProvodka,
      'id' | 'smeta_name' | 'smeta_number' | 'month_summa' | 'year_summa' | 'smeta_id'
    >,
    RealCostMonthGrafik,
    RealCostYearGrafik {
  first: boolean
  size: number
}

export enum OdinoxTypeName {
  Grafik = 'grafik',
  BankPrixod = 'bank_prixod',
  Jur1_2 = 'jur1_jur2_rasxod',
  Jur3 = 'jur3a_akt_avans',
  Remaining = 'remaining'
}

export interface OdinoxType {
  id: number
  name: `${OdinoxTypeName}` | `${OdinoxTypeName}_year`
  created_at: string
  updated_at: string
  is_deleted: boolean
  sort_order: number
}

export interface OdinoxUniqueSchet {
  schet: string
  prixod: number
  rasxod: number
}
