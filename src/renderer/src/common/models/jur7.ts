import type { Group } from './group'
import type { SaldoProduct } from './saldo'

export interface Jur7Child {
  naimenovanie_tovarov_jur7_id: number
  kol: number
  sena: number
  nds_foiz: number
  summa: number
  debet_schet: string
  debet_sub_schet: string
  kredit_schet: string
  kredit_sub_schet: string
  data_pereotsenka: string
  product: SaldoProduct
  group: Group
}
export interface Jur7Rasxod {
  id: number
  doc_num: string
  doc_date: string
  opisanie?: string
  summa: number
  kimdan_name: string
  kimga_name: string
  childs: Jur7Child[]
}
export interface Jur7Prixod {
  id: number
  doc_num: string
  doc_date: string
  opisanie?: string
  summa: number
  kimdan_name: string
  kimga_name: string
  childs: Jur7Child[]
}
export interface Jur7InternalTransfer {
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
  childs: Jur7Child[]
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
}

export enum WarehouseMonitoringType {
  prixod = 'prixod',
  rasxod = 'rasxod',
  internal = 'internal'
}
