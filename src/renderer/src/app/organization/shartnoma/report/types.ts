import type { ShartnomaGrafik } from '@renderer/common/models/shartnoma'

export interface ShartnomaGrafikPDFDocumentOptions {
  chapter: string
  subchapter: string
  section: string
  createdDate: string
  shartnomaDetails: string
  paymentDetails: string
  glav_mib: string
  rukovoditel: string
  grafiks: ShartnomaGrafik[]
}
