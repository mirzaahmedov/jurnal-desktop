export interface FinancialReceipt {
  id: number
  year: number
  month: number
  budjet_id: number
  summa: number
  user_id: number
  created_at: string
  updated_at: string
  isdeleted: boolean
}

export interface FinancialReceiptProvodka {
  doc_num: string
  doc_date: string
  doc_id: number
  schet: string
  summa: number
  document_id: number
  type_doc: string
  rasxod_schet: string
  schet_id: number
  opisanie?: string
}

export interface PrixodSchet {
  id: number
  schet_id: number
  user_id: number
  created_at: string
  updated_at: string
  isdeleted: boolean
  schet: string
  name: string
}

export enum FinancialReceiptProvodkaType {
  kassa_prixod_child = 'kassa_prixod_child',
  kassa_rasxod_child = 'kassa_rasxod_child',
  bank_prixod_child = 'bank_prixod_child',
  bank_rasxod_child = 'bank_rasxod_child',
  kursatilgan_hizmatlar_jur152_child = 'kursatilgan_hizmatlar_jur152_child',
  document_prixod_jur7_child = 'document_prixod_jur7_child',
  document_rasxod_jur7_child = 'document_rasxod_jur7_child',
  document_internal_jur7_child = 'document_internal_jur7_child'
}
