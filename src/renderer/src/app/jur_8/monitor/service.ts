import type { JUR8Monitor, JUR8MonitorChild, Response } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { budjet } from '@/common/features/crud/middleware'

class JUR8MonitorServiceBuilder extends CRUDService<
  JUR8Monitor,
  {
    year: number
    month: number
    childs: any[]
  }
> {
  constructor() {
    super({
      endpoint: ApiEndpoints.jur8_monitoring
    })

    this.getAutofillData = this.getAutofillData.bind(this)
    this.getMonitorById = this.getMonitorById.bind(this)
  }

  async getAutofillData(values: { budjet_id: number; year: number; month: number }) {
    const { budjet_id, year, month } = values
    const res = await this.client.get<
      Response<{
        childs: JUR8MonitorChild[]
        summa: number
      }>
    >(`${this.endpoint}/data`, {
      params: {
        budjet_id,
        year,
        month
      }
    })
    return res.data
  }

  async getMonitorById(ctx: QueryFunctionContext<[string, number, { budjet_id: number }]>) {
    const id = ctx.queryKey[1]
    const params = ctx.queryKey[2]
    const res = await this.client.get<
      Response<{
        year: number
        month: number
        childs: JUR8MonitorChild[]
        summa: number
      }>
    >(`${this.endpoint}/${id}`, {
      params
    })
    return res.data
  }
}

export const JUR8MonitorService = new JUR8MonitorServiceBuilder().use(budjet())
