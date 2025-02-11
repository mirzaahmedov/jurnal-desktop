import type { OrganizationFormValues } from './service'

const organizationQueryKeys = {
  getAll: 'organization/all',
  getById: 'organization',
  create: 'organization/create',
  update: 'organization/update',
  delete: 'organization/delete'
}

const defaultValues: OrganizationFormValues = {
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

export { defaultValues, organizationQueryKeys }
