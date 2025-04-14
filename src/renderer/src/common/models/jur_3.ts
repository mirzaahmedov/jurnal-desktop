export interface OrganSaldoProvodka {
  id: number
  parent_id: number
  organization_id: number
  created_at: string
  updated_at: string
  isdeleted: boolean
  prixod: number
  rasxod: number
  name: string
  _total: boolean
}
export interface OrganSaldo {
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
  childs: OrganSaldoProvodka[]
  account_number: string
  schet: string
  prixod: number
  rasxod: number
  first: true
}

export interface OrganSaldoMonthValue {
  budjet_id: number
  doc_id: number
  main_schet_id: number
  month: number
  schet_id: number
  year: number
}
