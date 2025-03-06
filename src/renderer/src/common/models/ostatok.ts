import type { Group } from './group'
import type { Naimenovanie } from './naimenovanie'
import type { Responsible } from './responsible'

export interface OstatokGroup {
  id: number
  smeta_id: number
  name: string
  schet: string
  iznos_foiz: number
  provodka_debet: string
  group_number: string
  provodka_kredit: string
  provodka_subschet: string
  roman_numeral: any
  pod_group: string
  smeta_name: string
  smeta_number: string
  products: OstatokProduct[]
}

export interface OstatokProduct {
  id: number
  user_id: number
  naimenovanie_tovarov_jur7_id: number
  kol: number
  sena: number
  summa: number
  year: number
  month: number
  date_saldo: string
  kimning_buynida: number
  created_at: string
  updated_at: string
  isdeleted: boolean
  iznos_summa_bir_oylik: number
  prixod_id: number
  doc_date: string
  iznos: boolean
  doc_num: string
  region_id: number
  iznos_schet: string
  iznos_sub_schet: string
  iznos_summa: number
  eski_iznos_summa: number
  iznos_start: any
  responsible_id: number
  product: Naimenovanie
  name: string
  edin: string
  group_jur7_name: string
  prixod_data: { type; doc_num: string; doc_date: string; doc_id: number }
  group: Group
  responsible: Responsible
  from: {
    kol: number
    sena: number
    summa: number
    iznos_summa: number
    iznos_schet: string
    iznos_sub_schet: string
  }
  internal: {
    kol: number
    kol_rasxod: number
    kol_prixod: number
    summa: number
    summa_prixod: number
    summa_rasxod: number
    iznos_rasxod: number
    iznos_prixod: number
    iznos_summa: number
  }
  to: {
    kol: number
    summa: number
    iznos_summa: number
    sena: number
    month_iznos: number
    eski_iznos_summa: number
  }
}
