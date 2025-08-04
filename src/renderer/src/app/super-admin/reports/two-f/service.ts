import type { TwoFAutoFillSubChild } from './details/interfaces'
import type { TwoFMeta } from './details/utils'
import type { AdminTwoF, ApiResponseMeta, ReportStatus } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'

export type TwoFPayloadChild = Omit<TwoFAutoFillSubChild, 'id' | 'smeta_grafik'>
export interface TwoFPayload {
  status: ReportStatus
}

class AdminTwoFServiceBuilder extends CRUDService<
  AdminTwoF,
  TwoFPayload,
  TwoFPayload,
  TwoFMeta & ApiResponseMeta
> {
  constructor() {
    super({
      endpoint: ApiEndpoints.admin_two_f
    })
  }
}

export const AdminTwoFService = new AdminTwoFServiceBuilder()
