import { z } from 'zod'

import { withPreprocessor } from '@/common/lib/validation'

export const WarehousePodrazdelenieQueryKeys = {
  getAll: 'warehouse-podrazdelenie/all',
  getById: 'warehouse-podrazdelenie',
  create: 'warehouse-podrazdelenie/create',
  update: 'warehouse-podrazdelenie/update',
  delete: 'warehouse-podrazdelenie/delete'
}

export const WarehousePodrazdelenieFormSchema = withPreprocessor(
  z.object({
    name: z.string()
  })
)

export type WarehousePodrazdelenieFormValues = z.infer<typeof WarehousePodrazdelenieFormSchema>

export const defaultValues: WarehousePodrazdelenieFormValues = {
  name: ''
}
