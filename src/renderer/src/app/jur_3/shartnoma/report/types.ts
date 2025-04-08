import type { Podpis } from '@/common/models'
import type { ShartnomaGrafik } from '@/common/models/shartnoma'

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
