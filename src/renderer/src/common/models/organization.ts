export interface Organization {
  parent_id?: number
  id: number
  name: string
  bank_klient: string
  raschet_schet: Organization.RaschetSchet[]
  raschet_schet_gazna: Organization.RaschetSchetGazna[]
  mfo: string
  inn: string
  okonx: string
  childs: Organization[]
}

export type OrganizationMonitorProvodka =
  | 'bank_prixod'
  | 'bank_rasxod'
  | 'kassa_prixod'
  | 'kassa_rasxod'
  | 'show_service'
  | 'akt'
  | 'jur7_prixod'
  | 'jur7_rasxod'
  | 'jur7_internal'

export type OrganizationMonitor = {
  id: number
  shartnoma_id: number
  shrtnoma_doc_num: string
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
  type: OrganizationMonitorProvodka
}

export namespace Organization {
  export interface RaschetSchet {
    id: number
    spravochnik_organization_id: number
    raschet_schet: string
  }
  export interface RaschetSchetGazna {
    id: number
    spravochnik_organization_id: number
    raschet_schet_gazna: string
  }
}
