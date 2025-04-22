export interface OdinoxAutoFillSubChild {
  name: string
  number: string
  prixod: number
  rasxod: number
}
export interface OdinoxAutoFill {
  id: number
  name: string
  created_at: string
  updated_at: string
  is_deleted: boolean
  sort_order: number
  prixod: number
  rasxod: number
  sub_childs: Array<OdinoxAutoFillSubChild>
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
