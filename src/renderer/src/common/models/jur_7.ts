import type { Group } from './group'
import type { Organization } from './organization'
import type { SaldoProduct } from './saldo'
import type { Shartnoma } from './shartnoma'
import type { ShartnomaGrafik } from './shartnoma-grafik'

export interface WarehousePrixodProvodka {
  naimenovanie_tovarov_jur7_id: number
  serial_num: string
  inventar_num: string
  edin: string
  kol: number
  sena: number
  nds_foiz: number
  summa: number
  iznos: boolean
  iznos_start: string
  eski_iznos_summa: number
  debet_schet: string
  debet_sub_schet: string
  kredit_schet: string
  kredit_sub_schet: string
  data_pereotsenka: string
  group_number: string
}
export interface WarehousePrixod {
  id: number
  doc_num: string
  doc_date: string
  opisanie?: string
  summa: number
  kimdan_name: string
  kimga_name: string
  doverennost?: string
  organ: Organization
  account_number: Organization.RaschetSchet
  contract: Shartnoma
  contract_grafik: ShartnomaGrafik
  smeta_name: string
  smeta_number: string
  podraz_name: string
  responsible: string
  childs: WarehousePrixodProvodka[]
}

export interface WarehouseRasxodProvodka {
  id: number
  user_id: number
  document_rasxod_jur7_id: number
  naimenovanie_tovarov_jur7_id: number
  kol: number
  sena: number
  nds_foiz: any
  nds_summa: any
  summa_s_nds: any
  summa: number
  debet_schet: string
  debet_sub_schet: string
  kredit_schet: string
  kredit_sub_schet: string
  data_pereotsenka: string
  main_schet_id: number
  created_at: string
  updated_at: string
  isdeleted: boolean
  iznos_schet: string
  iznos_sub_schet: string
  iznos_summa: number
  iznos: boolean
  budjet_id: any
  product: SaldoProduct
  group: Group
}

export interface WarehouseRasxod {
  id: number
  doc_num: string
  doc_date: string
  opisanie?: string
  summa: number
  kimdan_name: string
  kimga_name: string
  doverennost?: string
  podraz_name: string
  responsible: string
  childs: WarehouseRasxodProvodka[]
}

export interface WarehouseInternalProvodka {
  naimenovanie_tovarov_jur7_id: number
  kol: number
  sena: number
  summa: number
  iznos?: boolean
  iznos_summa?: number
  iznos_schet?: string
  iznos_sub_schet?: string
  debet_schet: string
  debet_sub_schet: string
  kredit_schet: string
  kredit_sub_schet: string
  data_pereotsenka: string
  product: SaldoProduct
  group: Group
}
export interface WarehouseInternal {
  id: number
  doc_num: string
  doc_date: string
  opisanie?: string
  summa: number
  kimdan_id: number
  kimdan_name: string
  kimga_name: string
  kimga_id: number

  kimdan: string
  kimdan_podraz_name: string
  kimga: string
  kimga_podraz_name: string

  doverennost?: string
  childs: WarehouseInternalProvodka[]
}

export interface WarehouseMonitoring {
  id: number
  doc_num: string
  doc_date: string
  opisanie: any
  summa_rasxod: number
  summa_prixod: number
  from_id: number
  from_name: string
  to_id: number
  to_name: string
  user_id: number
  login: string
  fio: string
  kredit_schet: string
  kredit_sub_schet: string
  debet_schet: string
  debet_sub_schet: string
  type: WarehouseMonitoringType
  combined_doc_date: string
  combined_id: number
  combined_doc_num: string
  schets: Array<{
    kredit_schet: string
    kredit_sub_schet: string
    debet_schet: string
    debet_sub_schet: string
  }>
}

export enum WarehouseMonitoringType {
  prixod = 'prixod',
  rasxod = 'rasxod',
  internal = 'internal'
}
