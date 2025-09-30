import type { ProvodkaType } from './common'

export interface Organization {
  parent_id?: number
  id: number
  name: string
  bank_klient: string
  account_numbers: Organization.RaschetSchet[]
  gaznas: Organization.RaschetSchetGazna[]
  mfo: string
  inn: string
  okonx: string
  childs: Organization[]
  address: string
  director: string
  user_id: number
  fio: string
  login: string
  sub_childs: OrganizationSubchild[]
}

export interface OrganizationMonitor {
  id: number
  shartnoma_id: number
  shartnoma_doc_date: string
  shartnoma_doc_num: string
  organ_id: number
  organ_inn: string
  organ_name: string
  doc_num: string
  doc_date: string
  opisanie: string
  summa_rasxod: number
  summa_prixod: number
  provodki_schet: string
  provodki_sub_schet: string
  user_id: number
  login: string
  fio: string
  schet_array: Array<string>
  type: ProvodkaType
}

export namespace Organization {
  export type RaschetSchet = {
    id: number
    spravochnik_organization_id: number
    raschet_schet: string
  }
  export type RaschetSchetGazna = {
    id: number
    spravochnik_organization_id: number
    raschet_schet_gazna: string
  }
}

export interface OrganizationSubchild {
  id: number
  doc_num: string
  doc_date: string
  user_id: number
  summa: number
  opisanie: string
  smeta_id: null
  smeta2_id: null
  spravochnik_organization_id: number
  pudratchi_bool: boolean
  created_at: string
  updated_at: string
  isdeleted: boolean
  yillik_oylik: null
  budjet_id: null
  main_schet_id: number
  contract_id: number
  conrtact_summa: number
}
