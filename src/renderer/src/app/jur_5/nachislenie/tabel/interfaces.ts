import type { TabelProvodka } from '@/common/models/tabel'

export interface TabelDetailsFormValues {
  values: Array<{
    id: number
    vacantId: number
    vacantName: string
    children: TabelProvodka[]
  }>
}
