import type { Mainbook } from '@renderer/common/models'

import { ApiEndpoints, CRUDService } from '@renderer/common/features/crud'
import { budjet } from '@renderer/common/features/crud/middleware'

export interface MainbookPayloadChild {
  type_id: number
  sub_childs: Array<{
    schet: string
    prixod: number
    rasxod: number
  }>
}
export interface MainbookPayload {
  month: number
  year: number
  childs: Array<MainbookPayloadChild>
}

export const mainbookService = new CRUDService<Mainbook, MainbookPayload>({
  endpoint: ApiEndpoints.mainbook
}).use(budjet())
