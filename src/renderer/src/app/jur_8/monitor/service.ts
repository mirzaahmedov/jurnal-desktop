import type {
  ApiResponse,
  ApiResponseMeta,
  FinancialReceipt,
  FinancialReceiptProvodka
} from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { budjet, main_schet } from '@/common/features/crud/middleware'

interface FinancialReceiptFormValues {
  year: number
  month: number
  childs: any[]
}
interface FinancialReceiptMeta extends ApiResponseMeta {
  summa: number
}

class FinancialReceiptServiceBuilder extends CRUDService<
  FinancialReceipt,
  FinancialReceiptFormValues,
  FinancialReceiptFormValues,
  FinancialReceiptMeta
> {
  constructor() {
    super({
      endpoint: ApiEndpoints.jur8_monitoring
    })

    this.getAutofillData = this.getAutofillData.bind(this)
    this.getMonitorById = this.getMonitorById.bind(this)
  }

  async getAutofillData(values: {
    budjet_id: number
    main_schet_id: number
    year: number
    month: number
  }) {
    const { budjet_id, main_schet_id, year, month } = values
    const res = await this.client.get<
      ApiResponse<{
        childs: FinancialReceiptProvodka[]
        summa: number
      }>
    >(`${this.endpoint}/data`, {
      params: {
        budjet_id,
        main_schet_id,
        year,
        month
      }
    })
    return res.data
  }

  async getMonitorById(
    ctx: QueryFunctionContext<[string, number, { budjet_id: number; main_schet_id: number }]>
  ) {
    const id = ctx.queryKey[1]
    const params = ctx.queryKey[2]
    const res = await this.client.get<
      ApiResponse<{
        year: number
        month: number
        childs: FinancialReceiptProvodka[]
        summa: number
      }>
    >(`${this.endpoint}/${id}`, {
      params
    })
    return res.data
  }
}

export const FinancialReceiptService = new FinancialReceiptServiceBuilder()
  .use(budjet())
  .use(main_schet())
