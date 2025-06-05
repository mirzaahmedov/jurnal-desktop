import type { IznosFormValues } from './config'
import type { ApiResponseMeta } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { main_schet } from '@/common/features/crud/middleware'

interface IznosMeta extends ApiResponseMeta {
  pageCount: number
  count: number
  currentPage: number
  limit: number
  nextPage: number
  backPage: any
  from_summa: number
  from_kol: number
  internal_rasxod_summa: number
  internal_rasxod_kol: number
  internal_prixod_summa: number
  internal_prixod_kol: number
  to_summa: number
  to_iznos_summa: number
  to_kol: number
  page_from_summa: number
  page_from_kol: number
  page_internal_rasxod_summa: number
  page_internal_rasxod_kol: number
  page_internal_prixod_summa: number
  page_internal_prixod_kol: number
  page_to_summa: number
  page_to_iznos_summa: number
  page_to_kol: number
}

export const IznosService = new CRUDService<never, IznosFormValues, IznosFormValues, IznosMeta>({
  endpoint: ApiEndpoints.jur7_iznos_summa
}).use(main_schet())
