import { z } from 'zod'
import { withPreprocessor } from '@/common/lib/validation'

export const denominationQueryKeys = {
  getAll: 'denomination/all',
  getById: 'denomination',
  create: 'denomination/create',
  update: 'denomination/update',
  delete: 'denomination/delete'
}

export const DenominationPayloadSchema = withPreprocessor(
  z.object({
    name: z.string(),
    edin: z.string(),
    inventar_num: z.string().optional(),
    serial_num: z.string().optional(),
    group_jur7_id: z.number(),
    spravochnik_budjet_name_id: z.number()
  })
)

export type DenominationPayloadType = z.infer<typeof DenominationPayloadSchema>

export const defaultValues: DenominationPayloadType = {
  name: '',
  edin: '',
  group_jur7_id: 0,
  spravochnik_budjet_name_id: 0
}
