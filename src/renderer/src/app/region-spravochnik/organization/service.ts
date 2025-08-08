import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import type { ApiResponse, Organization } from '@/common/models'

import { t } from 'i18next'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { SpravochnikSearchField } from '@/common/features/filters/search/search-filter-spravochnik'
import { extendObject } from '@/common/lib/utils'

import { OrganizationColumns } from './columns'
import { type OrganizationFormValues, OrganizationQueryKeys } from './config'
import { OrganizationDialog } from './dialog'

export interface UpdateChildArgs {
  parentId: number
  childs: {
    id: number
  }[]
}

export class OrganizationServiceBuilder extends CRUDService<Organization, OrganizationFormValues> {
  constructor() {
    super({
      endpoint: ApiEndpoints.organization
    })

    this.updateChild = this.updateChild.bind(this)
  }

  async updateChild({ parentId, childs }: UpdateChildArgs) {
    const res = await this.client.put<ApiResponse<Organization>>(`${this.endpoint}/parent`, {
      parent_id: parentId,
      organization_ids: childs
    })
    return res.data
  }
}

export const OrganizationService = new OrganizationServiceBuilder()

export const createOrganizationSpravochnik = (
  config: Partial<SpravochnikHookOptions<Organization>>
) => {
  return extendObject(
    {
      title: t('choose', { what: t('organization') }),
      endpoint: ApiEndpoints.organization,
      columnDefs: OrganizationColumns,
      service: OrganizationService,
      filters: [SpravochnikSearchField],
      Dialog: OrganizationDialog,
      queryKeys: OrganizationQueryKeys
    } satisfies typeof config,
    config
  )
}
