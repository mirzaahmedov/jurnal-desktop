import type {
  ApiResponse,
  ApiResponseMeta,
  RealCost,
  RealCostDocument,
  RealCostProvodka
} from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { main_schet } from '@/common/features/crud/middleware'

export enum DocType {
  MonthSumma = 'month_summa',
  YearSumma = 'year_summa',
  ContractGrafikMonth = 'contract_grafik_month',
  ContractGrafikYear = 'contract_grafik_year',
  RasxodMonth = 'rasxod_month',
  RasxodYear = 'rasxod_year',
  RemainingMonth = 'remaining_month',
  RemainingYear = 'remaining_year'
}

export interface GetDocsArgs {
  need_data: RealCostProvodka[]
  smeta_id: number
  main_schet_id: number
  month: number
  year: number
  grafik_id?: number
  type: DocType
}

export interface RealCostMeta extends ApiResponseMeta {
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
export interface RealCostPayload {
  month: number
  year: number
  childs: RealCostProvodka[]
}

class RealCostServiceBuilder extends CRUDService<
  RealCost,
  RealCostPayload,
  RealCostPayload,
  RealCostMeta
> {
  constructor() {
    super({
      endpoint: ApiEndpoints.realcost
    })

    this.getAutofillData = this.getAutofillData.bind(this)
    this.getDocs = this.getDocs.bind(this)
  }

  async getAutofillData(params: { month: number; year: number; main_schet_id: number }) {
    const res = await this.client.get<ApiResponse<RealCostProvodka[], RealCostMeta>>(
      `${this.endpoint}/data`,
      { params }
    )
    return res.data
  }

  async getDocs(values: GetDocsArgs) {
    const { need_data, ...params } = values
    const res = await this.client.post<ApiResponse<RealCostDocument[], { summa: number }>>(
      `${this.endpoint}/docs`,
      {
        need_data
      },
      {
        params
      }
    )
    return res.data
  }
}

export const RealCostService = new RealCostServiceBuilder().use(main_schet())
