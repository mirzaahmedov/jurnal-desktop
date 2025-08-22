import type { Podpis } from '@/common/models'
import type { ShartnomaGrafik } from '@/common/models/shartnoma'

export interface ShartnomaGrafikOptions {
  organName: string
  regionName: string
  docDate: string
  docNum: string
  podpis: Podpis[]
  grafiks: ShartnomaGrafik[]
  summaValue: number
}
