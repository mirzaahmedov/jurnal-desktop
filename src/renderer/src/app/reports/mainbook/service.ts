import type { MainbookAutoFill, MainbookType, MainbookUniqueSchet } from './details/interfaces'
import type { Mainbook, MainbookDocs, Response } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { budjet } from '@/common/features/crud/middleware'

export interface MainbookPayloadChild {
  type_id: number
  sub_childs: Array<{
    schet: string
    prixod: number
    rasxod: number
  }>
}
export interface MainbookPayload {
  month: number
  year: number
  childs: Array<MainbookPayloadChild>
}

class MainbookServiceBuilder extends CRUDService<Mainbook, MainbookPayload> {
  constructor() {
    super({
      endpoint: ApiEndpoints.mainbook
    })

    this.getTypes = this.getTypes.bind(this)
    this.getSaldoCheck = this.getSaldoCheck.bind(this)
    this.getAutofillData = this.getAutofillData.bind(this)
    this.getUniqueSchets = this.getUniqueSchets.bind(this)
    this.getMainbookDocs = this.getMainbookDocs.bind(this)
  }

  async getAutofillData(params: { month: number; year: number; budjet_id: number }) {
    const res = await this.client.get<Response<MainbookAutoFill[]>>(`${this.endpoint}/data`, {
      params
    })
    return res.data
  }

  async getTypes(ctx: QueryFunctionContext<[string, { budjet_id?: number }]>) {
    const params = ctx.queryKey[1]
    const res = await this.client.get<Response<MainbookType[]>>(`${this.endpoint}/type`, {
      params
    })
    return res.data
  }

  async getSaldoCheck(params: { budjet_id: number }) {
    const res = await this.client.get<Response<unknown>>(`${this.endpoint}/check`, {
      headers: {
        'notify-error': false
      },
      params
    })
    return res.data
  }

  async getUniqueSchets(params: { budjet_id: number }) {
    const res = await this.client.get<
      Response<{
        schets: MainbookUniqueSchet[]
      }>
    >(`${this.endpoint}/unique`, {
      headers: {
        'notify-error': false
      },
      params
    })
    return res.data
  }

  async getMainbookDocs(params: {
    budjet_id: number
    month: number
    year: number
    type_id: number
    schet: string
    prixod?: boolean
    rasxod?: boolean
  }) {
    const res = await this.client.get<Response<MainbookDocs[]>>(`${this.endpoint}/docs`, {
      params
    })
    return res.data
  }
}

export const MainbookService = new MainbookServiceBuilder().use(budjet())
