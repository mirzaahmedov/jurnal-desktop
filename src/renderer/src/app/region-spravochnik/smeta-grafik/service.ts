import type { SmetaGrafikForm } from './config'
import type { SmetaGrafik } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { main_schet } from '@/common/features/crud/middleware'

export const SmetaGrafikService = new CRUDService<SmetaGrafik, SmetaGrafikForm>({
  endpoint: ApiEndpoints.smeta_grafik
}).use(main_schet())
