import type { OrganizationFormValues } from './service'

export const organizationQueryKeys = {
  getAll: 'organization/all',
  getById: 'organization',
  create: 'organization/create',
  update: 'organization/update',
  delete: 'organization/delete'
}

export const defaultValues: OrganizationFormValues = {
  name: '',
  bank_klient: '',
  inn: '',
  mfo: '',
  account_numbers: [
    {
      raschet_schet: ''
    }
  ],
  gaznas: [
    {
      raschet_schet_gazna: ''
    }
  ],
  okonx: ''
}
