import type { Prixodbook } from '@renderer/common/models'

import { ApiEndpoints, CRUDService } from '@renderer/common/features/crud'
import { budjet } from '@renderer/common/features/crud/middleware'

export interface PrixodbookPayloadChild {
  type_id: number
  sub_childs: Array<{
    schet: string
    prixod: number
    rasxod: number
  }>
}
export interface PrixodbookPayload {
  month: number
  year: number
  childs: Array<PrixodbookPayloadChild>
}

export const prixodbookService = new CRUDService<Prixodbook, PrixodbookPayload>({
  endpoint: ApiEndpoints.prixodbook
}).use(budjet())
