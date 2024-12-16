import { z } from 'zod'
import { withPreprocessor } from '@/common/lib/validation'

export const responsibleQueryKeys = {
  getAll: 'responsible/all',
  getById: 'responsible',
  create: 'responsible/create',
  update: 'responsible/update',
  delete: 'responsible/delete'
}

export const ResponsiblePayloadSchema = withPreprocessor(
  z.object({
    fio: z.string(),
    spravochnik_podrazdelenie_jur7_id: z.number()
  })
)

export type ResponsiblePayloadType = z.infer<typeof ResponsiblePayloadSchema>

export const defaultValues: ResponsiblePayloadType = {
  fio: '',
  spravochnik_podrazdelenie_jur7_id: 0
}
