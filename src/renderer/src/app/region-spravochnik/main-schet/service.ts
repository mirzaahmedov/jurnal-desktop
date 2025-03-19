import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import type { MainSchet } from '@/common/models'

import { SpravochnikSearchField } from '@renderer/common/features/search/spravochnik-search-field'
import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { extendObject } from '@/common/lib/utils'
import { withPreprocessor } from '@/common/lib/validation'

import { mainSchetColumns } from './columns'

export const MainSchetPayloadSchema = withPreprocessor(
  z.object({
    spravochnik_budjet_name_id: z.number(),
    tashkilot_nomi: z.string(),
    tashkilot_bank: z.string(),
    tashkilot_mfo: z.string(),
    tashkilot_inn: z.string(),
    account_number: z.string(),
    account_name: z.string(),
    jur1_schet: z.string(),
    jur1_subschet: z.string().optional(),
    jur2_schet: z.string(),
    jur2_subschet: z.string().optional(),
    jur3_schet: z.string(),
    jur3_subschet: z.string().optional(),
    jur4_schet: z.string(),
    jur4_subschet: z.string().optional(),
    gazna_number: z.string().optional()
  })
)
export type MainSchetPayloadType = z.infer<typeof MainSchetPayloadSchema>

export const mainSchetService = new CRUDService<MainSchet, MainSchetPayloadType>({
  endpoint: ApiEndpoints.main_schet
})

export const createMainSchetSpravochnik = (config: SpravochnikHookOptions<MainSchet>) => {
  return extendObject(
    {
      title: 'Выберите основной счет',
      endpoint: ApiEndpoints.main_schet,
      columnDefs: mainSchetColumns,
      service: mainSchetService,
      filters: [SpravochnikSearchField]
    } satisfies typeof config,
    config
  )
}
