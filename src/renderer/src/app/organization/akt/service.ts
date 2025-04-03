import type { AktFormValues } from './config'
import type { Akt } from '@/common/models/akt'
import type { ResponseMeta } from '@renderer/common/models'

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
