import type { Group } from './group'
import type { Organization } from './organization'
import type { Responsible } from './responsible'
import type { SaldoProduct } from './saldo'
import type { Shartnoma } from './shartnoma'
import type { ShartnomaGrafik } from './shartnoma-grafik'

export interface WarehouseProvodka {
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
  childs: WarehouseProvodka[]
}
export interface WarehousePrixod {
  id: number
  doc_num: string
  doc_date: string
  opisanie?: string
  summa: number
  kimdan_name: string
  kimga_name: string
  organ: Organization
  account_number: Organization.RaschetSchet
  contract: Shartnoma
  contract_grafik: ShartnomaGrafik
  responsible: Responsible
  childs: WarehouseProvodka[]
}
export interface WarehouseInternal {
  id: number
  doc_num: string
  doc_date: string
  opisanie?: string
  summa: number
  kimdan_name: string
  kimga: {
    id: number
    spravochnik_podrazdelenie_jur7_id: number
    fio: string
    user_id: number
    created_at: string
    updated_at: string
    isdeleted: boolean
  }
  childs: WarehouseProvodka[]
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
