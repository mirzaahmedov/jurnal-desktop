import { ApiEndpoints, CRUDService } from '@renderer/common/features/crud'

import type { Ostatok } from '@renderer/common/models/ostatok'

export const ostatokService = new CRUDService<
  Ostatok,
  {
    year: number
    month: number
  }
>({
  endpoint: ApiEndpoints.jur7_saldo
})
