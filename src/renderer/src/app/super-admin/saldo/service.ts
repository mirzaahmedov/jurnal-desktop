import type { SaldoProduct } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'

export const AdminWarehouseSaldoService = new CRUDService<SaldoProduct>({
  endpoint: ApiEndpoints.admin__saldo
})
