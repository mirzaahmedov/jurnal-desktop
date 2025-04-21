import type { SmetaGrafikForm } from './config'
import type { SmetaGrafik } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'

export const SmetaGrafikService = new CRUDService<SmetaGrafik, SmetaGrafikForm>({
  endpoint: ApiEndpoints.smeta_grafik
})
