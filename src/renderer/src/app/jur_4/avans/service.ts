import type { AvansFormValues } from './config'
import type { Avans, ResponseMeta } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { jur4_schet, main_schet } from '@/common/features/crud/middleware'

export interface AvansMeta extends ResponseMeta {
  summa: number
}

export const AvansService = new CRUDService<Avans, AvansFormValues, AvansFormValues, AvansMeta>({
  endpoint: ApiEndpoints.avans
})
  .use(main_schet())
  .use(jur4_schet())
