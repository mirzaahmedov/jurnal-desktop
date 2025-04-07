import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import type { Operatsii, Response } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { SpravochnikSearchField } from '@/common/features/filters/search/search-filter-spravochnik'
import { http } from '@/common/lib/http'
import { extendObject } from '@/common/lib/utils'
import { withPreprocessor } from '@/common/lib/validation'
import { TypeSchetOperatsii } from '@/common/models'

import { operatsiiColumns } from './columns'

export const OperatsiiFormSchema = withPreprocessor(
  z.object({
    name: z.string(),
    schet: z.string(),
    sub_schet: z.string().optional(),
    type_schet: z.enum([
      TypeSchetOperatsii.KASSA_PRIXOD,
      TypeSchetOperatsii.KASSA_RASXOD,
      TypeSchetOperatsii.BANK_PRIXOD,
      TypeSchetOperatsii.BANK_RASXOD,
      TypeSchetOperatsii.AKT,
      TypeSchetOperatsii.AVANS_OTCHET,
      TypeSchetOperatsii.POKAZAT_USLUGI,
      TypeSchetOperatsii.JUR3,
      TypeSchetOperatsii.JUR4
    ]),
    smeta_id: z.number().optional()
  })
)
export type OperatsiiFormValues = z.infer<typeof OperatsiiFormSchema>
export type OperatsiiOption = {
  schet: string
}

export const getOperatsiiSchetOptionsQuery = async (
  ctx: QueryFunctionContext<[string, { type_schet?: string }]>
) => {
  const type_schet = ctx.queryKey[1].type_schet
  const res = await http.get<Response<OperatsiiOption[]>>('/spravochnik/operatsii/unique', {
    params: {
      type_schet
    }
  })
  return res.data
}

export const operatsiiService = new CRUDService<Operatsii, OperatsiiFormValues>({
  endpoint: ApiEndpoints.operatsii
}).forRequest((type, { config }) => {
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
      title: 'Выберите операцию',
      endpoint: ApiEndpoints.operatsii,
      columnDefs: operatsiiColumns,
      service: operatsiiService,
      filters: [SpravochnikSearchField]
    } satisfies typeof config,
    config
  )
}
