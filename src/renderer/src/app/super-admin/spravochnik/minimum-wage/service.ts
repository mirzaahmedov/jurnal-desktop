import { ApiEndpoints, CRUDService } from '@/common/features/crud'

export interface MinimumWage {
  id: number
  doc_num: string
  doc_date: string
  summa: number
  start: string
  created_at: string
  updated_at: string
  isdeleted: boolean
}

export class MinimumWageServiceBuilder extends CRUDService<
  MinimumWage,
  Pick<MinimumWage, 'id' | 'summa'>
> {
  QueryKeys = {
    GetAll: 'minimum-wage/get-wage',
    Update: 'minimum-wage/update'
  }
}

export const MinimumWageService = new MinimumWageServiceBuilder({
  endpoint: ApiEndpoints.admin_minimum_wage
})
