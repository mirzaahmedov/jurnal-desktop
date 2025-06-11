import { z } from 'zod'

export const DistanceQueryKeys = {
  GetAll: 'distance/all'
}

export const DistanceFormSchema = z.object({
  from_district_id: z.number().optional(),
  to_district_id: z.number().optional(),
  distance_km: z.number()
})
export type DistanceFormValues = z.infer<typeof DistanceFormSchema>

export const defaultValues: DistanceFormValues = {
  from_district_id: 0,
  to_district_id: 0,
  distance_km: 0
}
