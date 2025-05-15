import type { AktFormValues } from './config'
import type { ApiResponseMeta } from '@/common/models'
import type { Akt } from '@/common/models/akt'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { budjet, jur3_schet_159, main_schet } from '@/common/features/crud/middleware'

export const AktService = new CRUDService<
  Akt,
  AktFormValues,
  AktFormValues,
  ApiResponseMeta & { summa: number }
>({
  endpoint: ApiEndpoints.akt_priyom
})
  .use(main_schet())
  .use(budjet())
  .use(jur3_schet_159())
