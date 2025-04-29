import type { AdminRealCost, ResponseMeta } from '@/common/models'
import type { ReportStatus } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'

export interface AdminRealCostMeta extends ResponseMeta {
  month_summa: number
  year_summa: number
  by_month: {
    rasxod_summa: number
    contract_grafik_summa: number
    remaining_summa: number
  }
  by_year: {
    rasxod_summa: number
    contract_grafik_summa: number
    remaining_summa: number
  }
}
export interface AdminRealCostPayload {
  status: ReportStatus
}

class AdminRealCostServiceBuilder extends CRUDService<
  AdminRealCost,
  AdminRealCostPayload,
  AdminRealCostPayload,
  AdminRealCostMeta
> {
  constructor() {
    super({
      endpoint: ApiEndpoints.admin_realcost
    })
  }
}

export const AdminRealCostService = new AdminRealCostServiceBuilder()
