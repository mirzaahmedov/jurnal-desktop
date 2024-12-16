import type { SmetaGrafik } from '@/common/models'
import type { SmetaGrafikForm } from './constants'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'

const smetaGrafikService = new CRUDService<SmetaGrafik, SmetaGrafikForm>({
  endpoint: ApiEndpoints.smeta_grafik
})

export { smetaGrafikService }
