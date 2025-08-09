import type { ProvodkaType } from '@/common/models'

export interface AdminOrgan152 {
  id: number
  name: string
  main_schets: AdminOrgan152MainSchet[]
  summa_from: number
  prixod: number
  rasxod: number
  summa_to: number
  docs: AdminOrgan152Document[]
}

export interface AdminOrgan152MainSchet {
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
  jur3_schets_152: AdminOrgan152Schet[]
  jur4_schets: Array<{
    id: number
    schet: string
  }>
  summa_from: number
  prixod: number
  rasxod: number
  summa_to: number
  docs: AdminOrgan152Document[]
}

export interface AdminOrgan152Schet {
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
  docs: AdminOrgan152Document[]
}

export interface AdminOrgan152Document {
  id: number
  doc_num: string
  doc_date: string
  opisanie: string
  summa_rasxod: number
  summa_prixod: number
  shartnoma_id: number
  shartnoma_doc_num: string
  shartnoma_doc_date: string
  smeta_number: null
  organ_id: number
  organ_name: string
  organ_inn: string
  user_id: number
  login: string
  fio: string
  provodki_schet: string
  provodki_sub_schet: string
  type: ProvodkaType
  combined_doc_date: string
  combined_id: number
  combined_doc_num: string
}
