import { z } from 'zod'
import { withPreprocessor } from '@/common/lib/validation'

export const subdivision7QueryKeys = {
  getAll: 'subdivision-7/all',
  getById: 'subdivision-7',
  create: 'subdivision-7/create',
  update: 'subdivision-7/update',
  delete: 'subdivision-7/delete'
}

export const Subdivision7PayloadSchema = withPreprocessor(
  z.object({
    name: z.string()
  })
)

export type Subdivision7PayloadType = z.infer<typeof Subdivision7PayloadSchema>

export const defaultValues: Subdivision7PayloadType = {
  name: ''
}
