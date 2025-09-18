import type { MaterialSaldoProduct } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'

export const AdminWarehouseSaldoService = new CRUDService<MaterialSaldoProduct>({
  endpoint: ApiEndpoints.admin__saldo
})
