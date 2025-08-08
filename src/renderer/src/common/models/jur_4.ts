import type { ProvodkaType } from './common'

export interface PodotchetMonitor {
  id: number
  doc_num: string
  doc_date: string
  prixod_sum: number
  rasxod_sum: number
  opisanie: any
  podotchet_id: number
  podotchet_name: string
  podotchet_rayon: string
  login: string
  fio: string
  user_id: number
  child?: number
  provodki_schet: string
  provodki_sub_schet: string
  type: ProvodkaType
  combined_doc_date: string
  combined_id: number
  combined_doc_num: string
}

export interface PodotchetSaldoProvodka {
  id: number
  podotchet_id: number
  prixod: number
  rasxod: number
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
