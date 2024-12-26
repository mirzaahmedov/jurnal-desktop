export type AdminMainbook = {
  id: number
  month: number
  year: number
  budjet_id: number
  name: string
  user_id: number
  user_login: string
  accepted_id: null | number
  accepted_login: null | string
  accepted_time: null | string
  status: number
  region_id: number
  region_name: string
  created_at: string
}

export interface AdminMainbookDetails {
  id: number
  user_id: number
  user_id_accepted: number
  budjet_id: number
  accepted_time: string
  month: number
  year: number
  status: number
  data: Array<{
    type: string
    schets: Schet[]
    debet_sum: number
    kredit_sum: number
  }>
}

export interface Schet {
  spravochnik_operatsii_id: number
  schet_name: string
  schet: string
  debet_sum: number
  kredit_sum: number
}
