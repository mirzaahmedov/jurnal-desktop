import type { PokazatUslugiFormValues } from './config'
import type { PokazatUslugi } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { main_schet } from '@/common/features/crud/middleware'

export const pokazatUslugiService = new CRUDService<PokazatUslugi, PokazatUslugiFormValues>({
  endpoint: ApiEndpoints.pokazat_uslugi
}).use(main_schet())
