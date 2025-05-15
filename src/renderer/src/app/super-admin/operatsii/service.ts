import type { OperatsiiFormValues } from './config'
import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import type { ApiResponse, Operatsii } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { t } from 'i18next'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { SpravochnikSearchField } from '@/common/features/filters/search/search-filter-spravochnik'
import { extendObject } from '@/common/lib/utils'
import { TypeSchetOperatsii } from '@/common/models'

import { OperatsiiColumns } from './columns'

export type OperatsiiSchetOption = {
  schet: string
}
export class OperatsiiServiceBuilder extends CRUDService<Operatsii, OperatsiiFormValues> {
  constructor() {
    super({
      endpoint: ApiEndpoints.operatsii
    })

    this.getSchetOptions = this.getSchetOptions.bind(this)
  }

  async getSchetOptions(ctx: QueryFunctionContext<[string, { type_schet: string | undefined }]>) {
    const type_schet = ctx.queryKey[1].type_schet
    const res = await this.client.get<ApiResponse<OperatsiiSchetOption[]>>(
      `${this.endpoint}/unique`,
      {
        params: {
          type_schet
        }
      }
    )
    return res.data
  }
}

export const OperatsiiService = new OperatsiiServiceBuilder().forRequest((type, { config }) => {
  if (type === 'getAll') {
    const params = config.params
    if (params?.type_schet === TypeSchetOperatsii.ALL) {
      delete params.type_schet
    }
    return {
      config: {
        params
      }
    }
  }
  return {}
})

export const createOperatsiiSpravochnik = (config: Partial<SpravochnikHookOptions<Operatsii>>) => {
  return extendObject(
    {
      title: t('operatsii'),
      endpoint: ApiEndpoints.operatsii,
      columnDefs: OperatsiiColumns,
      service: OperatsiiService,
      filters: [SpravochnikSearchField]
    } satisfies typeof config,
    config
  )
}
