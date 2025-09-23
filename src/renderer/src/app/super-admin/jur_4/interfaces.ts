import type { AdminDocumentsType } from '../components/view-documents-modal'

export interface AdminPodotchet {
  id: number
  name: string
  main_schets: AdminPodotchetMainSchet[]
  summa_from: number
  prixod: number
  rasxod: number
  summa_to: number
  docs: AdminPodotchetDocument[]
}

export interface AdminPodotchetMainSchet {
  id: number
  account_number: string
  jur1_schet: string
  jur2_schet: string
  budjet_name: string
  budjet_id: number
  jur3_schets_159: Array<{
    id: number
    schet: string
  }>
  jur3_schets_152: Array<{
    id: number
    schet: string
  }>
  jur4_schets: AdminPodotchetSchet[]
  summa_from: number
  prixod: number
  rasxod: number
  summa_to: number
  docs: AdminPodotchetDocument[]
}

export interface AdminPodotchetSchet {
  id: number
  schet: string
  saldo: {
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
    childs: Array<{
      id: number
      parent_id: number
      organization_id: number
      created_at: string
      updated_at: string
      isdeleted: boolean
      prixod: number
      rasxod: number
      name: string
      inn: string
      bank_klient: string
      mfo: string
      summa: number
    }>
    account_number: string
    schet: string
    prixod: number
    rasxod: number
    summa: number
  }
  summa_from: number
  prixod: number
  rasxod: number
  summa_to: number
  docs: AdminPodotchetDocument[]
}

export interface AdminPodotchetDocument {
  id: number
  doc_num: string
  doc_date: string
  prixod_sum: number
  rasxod_sum: number
  opisanie: string
  podotchet_id: number
  podotchet_name: string
  podotchet_rayon: string
  login: string
  fio: string
  user_id: number
  provodki_schet: string
  provodki_sub_schet: string
  type: AdminDocumentsType.Podotchet
  combined_doc_date: string
  combined_id: number
  combined_doc_num: string
  child: number
}
