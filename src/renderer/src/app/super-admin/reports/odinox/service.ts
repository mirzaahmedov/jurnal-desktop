import type { OdinoxAutoFillSubChild } from './details/interfaces'
import type { AdminOdinox, ReportStatus } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'

export type OdinoxPayloadChild = Omit<OdinoxAutoFillSubChild, 'id' | 'smeta_grafik'>
export interface OdinoxPayload {
  status: ReportStatus
}

class AdminOdinoxServiceBuilder extends CRUDService<AdminOdinox, OdinoxPayload> {
  constructor() {
    super({
      endpoint: ApiEndpoints.admin_odinox
    })
  }
}

export const AdminOdinoxService = new AdminOdinoxServiceBuilder()
