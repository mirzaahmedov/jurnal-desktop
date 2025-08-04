export interface TwoFAutoFillSubChild {
  id: number
  smeta_name: string
  smeta_number: string
  group_number: string
  smeta_id: number
  summa: number
}
export interface TwoFAutoFill {
  id: number
  name: string
  sort_order: number
  created_at: string
  updated_at: string
  is_deleted: boolean
  type_id: number
  type_name: string
  sub_childs: TwoFAutoFillSubChild[]
  summa: number
}

export interface TwoFTableRow extends Record<string, number | string> {
  smeta_name: string
  smeta_number: string
  group_number: string
  smeta_id: number
}

export enum TwoFTypeName {
  Saldo = 'saldo',
  Grafik = 'grafik',
  BankPrixod = 'bank_prixod',
  Jur1_2 = 'jur1_jur2_rasxod',
  Jur3 = 'jur3a_akt_avans',
  Remaining = 'remaining'
}

export interface TwoFType {
  id: number
  name: `${TwoFTypeName}` | `${TwoFTypeName}_year`
  created_at: string
  updated_at: string
  is_deleted: boolean
  sort_order: number
}

export interface TwoFUniqueSchet {
  schet: string
  prixod: number
  rasxod: number
}
