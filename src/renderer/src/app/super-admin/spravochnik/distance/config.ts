import { z } from 'zod'

export const DistanceQueryKeys = {
  GetAll: 'distance/all'
}

export const DistanceFormSchema = z.object({
  from_region_id: z.number().optional(),
  to_region_id: z.number().optional(),
  distance_km: z.number().min(1)
})
export type DistanceFormValues = z.infer<typeof DistanceFormSchema>

export const defaultValues: DistanceFormValues = {
  from_region_id: 0,
  to_region_id: 0,
  distance_km: 0
}
