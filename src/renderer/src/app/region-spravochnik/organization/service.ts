import type { Organization } from '@/common/models'
import type { SpravochnikHookOptions } from '@/common/features/spravochnik'

import { z } from 'zod'
import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { withPreprocessor } from '@/common/lib/validation'
import { SpravochnikSearchField } from '@/common/features/search'
import { extendObject } from '@/common/lib/utils'
import { organizationColumns } from './columns'

export const OrganizationFormSchema = withPreprocessor(
  z.object({
    parent_id: z.number().optional(),
    name: z.string(),
    mfo: z.string(),
    inn: z.string(),
    bank_klient: z.string(),
    raschet_schet: z.string(),
    raschet_schet_gazna: z.string(),
    okonx: z.string()
  })
)
export type OrganizationFormPayload = z.infer<typeof OrganizationFormSchema>

export const organizationService = new CRUDService<Organization, OrganizationFormPayload>({
  endpoint: ApiEndpoints.organization
})

export const createOrganizationSpravochnik = (
  config: Partial<SpravochnikHookOptions<Organization>>
) => {
  return extendObject(
    {
      title: 'Выберите организацию',
      endpoint: ApiEndpoints.organization,
      columns: organizationColumns,
      service: organizationService,
      filters: [SpravochnikSearchField]
    } satisfies typeof config,
    config
  )
}
