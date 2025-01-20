import type { Organization } from '@/common/models'
import type { SpravochnikHookOptions } from '@/common/features/spravochnik'

import { z } from 'zod'
import { APIEndpoints, CRUDService } from '@/common/features/crud'
import { withPreprocessor } from '@/common/lib/validation'
import { SpravochnikSearchField } from '@/common/features/search'
import { extendObject } from '@/common/lib/utils'
import { organizationColumns } from './columns'
import { CreateOrganizationDialog } from './create-dialog'
import { organizationQueryKeys } from './config'

export const OrganizationFormSchema = withPreprocessor(
  z.object({
    parent_id: z.preprocess((value) => (!value ? undefined : value), z.number().optional()),
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
  endpoint: APIEndpoints.organization
})

export const createOrganizationSpravochnik = (
  config: Partial<SpravochnikHookOptions<Organization>>
) => {
  return extendObject(
    {
      title: 'Выберите организацию',
      endpoint: APIEndpoints.organization,
      columnDefs: organizationColumns,
      service: organizationService,
      filters: [SpravochnikSearchField],
      Dialog: CreateOrganizationDialog,
      queryKeys: organizationQueryKeys
    } satisfies typeof config,
    config
  )
}
