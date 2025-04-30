export interface PodotchetSaldoProvodka {
  id: number
  parent_id: number
  podotchet_id: number
  prixod: number
  rasxod: number
  created_at: string
  updated_at: string
  isdeleted: boolean
  name: string
  rayon: string
}

export interface PodotchetSaldo {
  id: number
  main_schet_id: number
  schet_id: number
  month: number
  year: number
  date_saldo: string
  budjet_id: number
  user_id: number
  created_at: string
  updated_at: string
  isdeleted: boolean
  first: boolean
  prixod: number
  rasxod: number
  summa: number
  childs: PodotchetSaldoProvodka[]
}

export interface PodotchetSaldoMonthValue {
  budjet_id: number
  doc_id: number
  main_schet_id: number
  month: number
  schet_id: number
  year: number
}
