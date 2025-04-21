import { z } from 'zod'

import { withPreprocessor } from '@/common/lib/validation'

export const OrganizationQueryKeys = {
  getAll: 'organization/all',
  getById: 'organization',
  create: 'organization/create',
  update: 'organization/update',
  delete: 'organization/delete'
}

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
    okonx: z.string().optional()
  })
)
export type OrganizationFormValues = z.infer<typeof OrganizationFormSchema>

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
