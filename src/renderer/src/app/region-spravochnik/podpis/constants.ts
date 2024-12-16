import { z } from 'zod'

const PodpisPayloadSchema = z.object({
  numeric_poryadok: z.number(),
  doljnost_name: z.string(),
  fio_name: z.string(),
  type_document: z.string()
})
type PodpisPayloadType = z.infer<typeof PodpisPayloadSchema>

const podpisQueryKeys = {
  getAll: 'podpis/all',
  getById: 'podpis',
  create: 'podpis/create',
  update: 'podpis/update',
  delete: 'podpis/delete'
}

const defaultValues: PodpisPayloadType = {
  numeric_poryadok: 0,
  doljnost_name: '',
  fio_name: '',
  type_document: ''
}

export { PodpisPayloadSchema, podpisQueryKeys, defaultValues }
export type { PodpisPayloadType }
