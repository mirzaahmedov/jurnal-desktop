import type { ProvodkaType } from './common'

export interface PodotchetSaldo {
  id: number
  main_schet_id: number
  schet_id: number
  summa: number
  month: number
  year: number
  date_saldo: string
  budjet_id: number
  user_id: number
  created_at: string
  updated_at: string
  isdeleted: boolean
  updated: boolean
}

export interface PodotchetMonitor {
  id: number
  doc_num: string
  doc_date: string
  prixod_sum: number
  rasxod_sum: number
  opisanie: string
  podotchet_id: number
  podotchet_name: string
  podotchet_rayon: string
  user_id: number
  fio: string
  login: string
  type: ProvodkaType
  operatsii?: string
  provodki_schet: string
  provodki_sub_schet: string
}
