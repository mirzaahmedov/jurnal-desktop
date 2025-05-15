import type { PokazatUslugiFormValues } from './config'
import type { ApiResponseMeta, PokazatUslugi } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { jur3_schet_152, main_schet } from '@/common/features/crud/middleware'

interface PokazatUslugiMeta extends ApiResponseMeta {
  summa: number
}

export const PokazatUslugiService = new CRUDService<
  PokazatUslugi,
  PokazatUslugiFormValues,
  PokazatUslugiFormValues,
  PokazatUslugiMeta
>({
  endpoint: ApiEndpoints.pokazat_uslugi
})
  .use(main_schet())
  .use(jur3_schet_152())
