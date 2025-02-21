import type { Podpis } from '@renderer/common/models'
import type { ShartnomaGrafik } from '@renderer/common/models/shartnoma'

export interface ShartnomaGrafikPDFDocumentOptions {
  chapter: string
  subchapter: string
  section: string
  createdDate: string
  shartnomaDetails: string
  paymentDetails: string
  podpis: Podpis[]
  grafiks: ShartnomaGrafik[]
}
