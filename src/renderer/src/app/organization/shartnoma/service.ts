import type { Shartnoma } from '@/common/models'
import type { SpravochnikHookOptions } from '@/common/features/spravochnik'

import { z } from 'zod'
import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { withPreprocessor } from '@/common/lib/validation'
import { budget } from '@/common/features/crud/middleware'
import { extendObject } from '@/common/lib/utils'
import { shartnomaColumns } from './columns'
import { SpravochnikSearchField } from '@/common/features/search'

export const shartnomaService = new CRUDService<Shartnoma, ShartnomaForm>({
  endpoint: ApiEndpoints.shartnoma
}).use(budget())

export const ShartnomaFormSchema = withPreprocessor(
  z.object({
    spravochnik_organization_id: z.number(),
    doc_num: z.string(),
    doc_date: z.string(),
    smeta_id: z.number(),
    smeta2_id: z.number().optional(),
    opisanie: z.string().optional(),
    summa: z.coerce.number(),
    pudratchi_bool: z.boolean(),
    grafik_year: z.number().optional(),
    yillik_oylik: z.boolean()
  })
)
export type ShartnomaForm = z.infer<typeof ShartnomaFormSchema>

export const createShartnomaSpravochnik = (config: Partial<SpravochnikHookOptions<Shartnoma>>) => {
  return extendObject(
    {
      title: 'Выберите договор',
      endpoint: ApiEndpoints.shartnoma,
      columns: shartnomaColumns,
      service: shartnomaService,
      filters: [SpravochnikSearchField]
    } satisfies typeof config,
    config
  )
}
