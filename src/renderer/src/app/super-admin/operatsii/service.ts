import type { Operatsii } from '@/common/models'
import type { SpravochnikHookOptions } from '@/common/features/spravochnik'

import { z } from 'zod'
import { TypeSchetOperatsii } from '@/common/models'
import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { withPreprocessor } from '@/common/lib/validation'
import { extendObject } from '@/common/lib/utils'
import { operatsiiColumns } from './columns'
import { SpravochnikSearchField } from '@/common/features/search'

const OperatsiiFormSchema = withPreprocessor(
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
      TypeSchetOperatsii.JUR7,
      TypeSchetOperatsii.GENERAL
    ]),
    smeta_id: z.number().optional()
  })
)
type OperatsiiForm = z.infer<typeof OperatsiiFormSchema>

const operatsiiService = new CRUDService<Operatsii, OperatsiiForm>({
  endpoint: ApiEndpoints.operatsii
})

const createOperatsiiSpravochnik = (config: Partial<SpravochnikHookOptions<Operatsii>>) => {
  return extendObject(
    {
      title: 'Выберите операцию',
      endpoint: ApiEndpoints.operatsii,
      columns: operatsiiColumns,
      service: operatsiiService,
      filters: [SpravochnikSearchField]
    } satisfies typeof config,
    config
  )
}

export { OperatsiiFormSchema, createOperatsiiSpravochnik, operatsiiService }
export type { OperatsiiForm }
