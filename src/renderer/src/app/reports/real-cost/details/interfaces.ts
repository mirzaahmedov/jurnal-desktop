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

export interface OdinoxTableRow extends Record<string, number | string> {
  smeta_name: string
  smeta_number: string
  group_number: string
  smeta_id: number
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
