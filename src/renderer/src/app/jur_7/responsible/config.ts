import { z } from 'zod'

import { withPreprocessor } from '@/common/lib/validation'

export const ResponsibleQueryKeys = {
  getAll: 'responsible/all',
  getById: 'responsible',
  create: 'responsible/create',
  update: 'responsible/update',
  delete: 'responsible/delete'
}

export const ResponsibleFormSchema = withPreprocessor(
  z.object({
    fio: z.string(),
    spravochnik_podrazdelenie_jur7_id: z.number()
  })
)

export type ResponsibleFormValues = z.infer<typeof ResponsibleFormSchema>

export const defaultValues: ResponsibleFormValues = {
  fio: '',
  spravochnik_podrazdelenie_jur7_id: 0
}
