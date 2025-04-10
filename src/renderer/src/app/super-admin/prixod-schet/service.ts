import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import type { PrixodSchet } from '@/common/models'

import { t } from 'i18next'
import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { extendObject } from '@/common/lib/utils'
import { withPreprocessor } from '@/common/lib/validation'

import { prixodSchetColumns } from './columns'

export const PrixodSchetFormSchema = withPreprocessor(
  z.object({
    name: z.string(),
    schet: z.string()
  })
)
export type PrixodSchetFormValues = z.infer<typeof PrixodSchetFormSchema>

export const PrixodSchetService = new CRUDService<PrixodSchet, PrixodSchetFormValues>({
  endpoint: ApiEndpoints.admin_prixod_schets
})

export const createPrixodSchetSpravochnik = (
  config: Partial<SpravochnikHookOptions<PrixodSchet>>
) => {
  return extendObject(
    {
      title: t('choose', { what: t('schet') }),
      endpoint: ApiEndpoints.admin_prixod_schets,
      columnDefs: prixodSchetColumns,
      service: PrixodSchetService
    } satisfies typeof config,
    config
  )
}
