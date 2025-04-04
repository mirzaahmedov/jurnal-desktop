import type { AktFormValues } from './config'
import type { ResponseMeta } from '@/common/models'
import type { Akt } from '@/common/models/akt'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { main_schet } from '@/common/features/crud/middleware'

export const aktService = new CRUDService<
  Akt,
  AktFormValues,
  AktFormValues,
  ResponseMeta & { summa: number }
>({
  endpoint: ApiEndpoints.akt_priyom
}).use(main_schet())
