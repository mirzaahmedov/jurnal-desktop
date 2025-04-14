import type { PokazatUslugiFormValues } from './config'
import type { PokazatUslugi } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { jur3_schet_159, main_schet } from '@/common/features/crud/middleware'

export const PokazatUslugiService = new CRUDService<PokazatUslugi, PokazatUslugiFormValues>({
  endpoint: ApiEndpoints.pokazat_uslugi
})
  .use(main_schet())
  .use(jur3_schet_159())
