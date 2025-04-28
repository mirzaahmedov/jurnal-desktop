import type { OdinoxAutoFillSubChild, OdinoxUniqueSchet } from './details/interfaces'
import type { OdinoxDocumentInfo, RealCost, RealCostProvodka, Response } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { main_schet } from '@/common/features/crud/middleware'

export type OdinoxPayloadChild = Omit<OdinoxAutoFillSubChild, 'id' | 'smeta_grafik'>
export interface RealCostPayload {
  month: number
  year: number
  childs: RealCostProvodka[]
}

class RealCostServiceBuilder extends CRUDService<RealCost, RealCostPayload> {
  constructor() {
    super({
      endpoint: ApiEndpoints.realcost
    })

    this.getSaldoCheck = this.getSaldoCheck.bind(this)
    this.getAutofillData = this.getAutofillData.bind(this)
    this.getUniqueSchets = this.getUniqueSchets.bind(this)
    this.getMainbookDocuments = this.getMainbookDocuments.bind(this)
  }

  async getAutofillData(params: { month: number; year: number; main_schet_id: number }) {
    const res = await this.client.get<Response<RealCostProvodka[]>>(`${this.endpoint}/data`, {
      params
    })
    return res.data
  }

  async getSaldoCheck(params: { budjet_id: number; main_schet_id: number }) {
    const res = await this.client.get<Response<unknown>>(`${this.endpoint}/check`, {
      headers: {
        'notify-error': false
      },
      params
    })
    return res.data
  }

  async getUniqueSchets(params: { budjet_id: number; main_schet_id: number }) {
    const res = await this.client.get<
      Response<{
        schets: OdinoxUniqueSchet[]
      }>
    >(`${this.endpoint}/unique`, {
      headers: {
        'notify-error': false
      },
      params
    })
    return res.data
  }

  async getMainbookDocuments(
    ctx: QueryFunctionContext<
      [
        string,
        {
          budjet_id: number
          main_schet_id: number
          month: number
          year: number
          type_id: number
          schet: string
          prixod: boolean
          rasxod: boolean
        }
      ]
    >
  ) {
    const params = ctx.queryKey[1]
    const res = await this.client.get<Response<OdinoxDocumentInfo[], { summa: number }>>(
      `${this.endpoint}/docs`,
      {
        params
      }
    )
    return res.data
  }
}

export const RealCostService = new RealCostServiceBuilder().use(main_schet())
