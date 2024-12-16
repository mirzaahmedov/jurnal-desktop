type Organization = {
  parent_id?: number
  id: number
  name: string
  bank_klient: string
  raschet_schet: string
  raschet_schet_gazna: string
  mfo: string
  inn: string
  okonx: string
  childs: Organization[]
}

type OrganizationMonitorProvodka =
  | 'bank_prixod'
  | 'bank_rasxod'
  | 'kassa_prixod'
  | 'kassa_rasxod'
  | 'show_service'
  | 'akt'

type OrganizationMonitor = {
  id: number
  shartnoma_id: number
  shrtnoma_doc_num: string
  organ_name: string
  doc_num: string
  doc_date: string
  opisanie: string
  summa_rasxod: number
  summa_prixod: number
  user_id: number
  login: string
  fio: string
  schet_array: Array<string>
  type: OrganizationMonitorProvodka
}

export type { Organization, OrganizationMonitor, OrganizationMonitorProvodka }
