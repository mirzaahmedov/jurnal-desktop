import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import type { Organization, Response } from '@/common/models'

import { http } from '@renderer/common/lib/http'
import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { SpravochnikSearchField } from '@/common/features/search'
import { extendObject } from '@/common/lib/utils'
import { withPreprocessor } from '@/common/lib/validation'

import { organizationColumns } from './columns'
import { organizationQueryKeys } from './config'
import { OrganizationDialog } from './dialog'

export const OrganizationFormSchema = withPreprocessor(
  z.object({
    parent_id: z.preprocess((value) => (!value ? undefined : value), z.number().optional()),
    name: z.string(),
    mfo: z.string(),
    inn: z.string(),
    bank_klient: z.string(),
    account_numbers: z.array(
      z.object({
        id: z.number().optional(),
        raschet_schet: z.string().nonempty()
      })
    ),
    gaznas: z.array(
      z.object({
        id: z.number().optional(),
        raschet_schet_gazna: z.string().nonempty()
      })
    ),
    okonx: z.string()
  })
)
export type OrganizationFormValues = z.infer<typeof OrganizationFormSchema>

export const organizationService = new CRUDService<Organization, OrganizationFormValues>({
  endpoint: ApiEndpoints.organization
})

export interface UpdateChildOrganizationArgs {
  parentId: number
  childs: {
    id: number
  }[]
}
export const updateChildOrganizationsQuery = async ({
  parentId,
  childs
}: UpdateChildOrganizationArgs) => {
  const res = await http.put<Response<Organization>>(`${ApiEndpoints.organization}/parent`, {
    parent_id: parentId,
    organization_ids: childs
  })
  return res.data
}

export const createOrganizationSpravochnik = (
  config: Partial<SpravochnikHookOptions<Organization>>
) => {
  return extendObject(
    {
      title: 'Выберите организацию',
      endpoint: ApiEndpoints.organization,
      columnDefs: organizationColumns,
      service: organizationService,
      filters: [SpravochnikSearchField],
      Dialog: OrganizationDialog,
      queryKeys: organizationQueryKeys
    } satisfies typeof config,
    config
  )
}
