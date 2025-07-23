import type { OdinoxAutoFillSubChild } from './details/interfaces'
import type { OdinoxMeta } from './details/utils'
import type { AdminOdinox, ApiResponseMeta, ReportStatus } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'

export type OdinoxPayloadChild = Omit<OdinoxAutoFillSubChild, 'id' | 'smeta_grafik'>
export interface OdinoxPayload {
  status: ReportStatus
}

class AdminOdinoxServiceBuilder extends CRUDService<
  AdminOdinox,
  OdinoxPayload,
  OdinoxPayload,
  OdinoxMeta & ApiResponseMeta
> {
  constructor() {
    super({
      endpoint: ApiEndpoints.admin_odinox
    })
  }
}

export const AdminOdinoxService = new AdminOdinoxServiceBuilder()
