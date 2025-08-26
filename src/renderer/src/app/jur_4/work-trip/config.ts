import { z } from 'zod'

export const WorkTripChildSchema = z.object({
  schet_id: z.number(),
  summa: z.number(),
  type: z.string()
})

export const WorkTripRoadSchema = z.object({
  road_ticket_number: z.string().optional(),
  from_region_id: z.number().min(1),
  to_region_id: z.number().min(1),
  km: z.number(),
  road_summa: z.number().min(1)
})

export const WorkTripHotelSchema = z.object({
  hostel_ticket_number: z.string().nonempty(),
  day: z.number().min(1),
  day_summa: z.number().min(1),
  hostel_summa: z.number().min(1)
})

export const WorkTripFormSchema = z.object({
  minimum_wage_id: z.number().min(1),
  doc_num: z.string().nonempty(),
  doc_date: z.string().nonempty(),
  from_date: z.string().nonempty(),
  to_date: z.string().nonempty(),
  day_summa: z.number(),
  hostel_summa: z.number(),
  road_summa: z.number(),
  summa: z.number(),
  comment: z.string(),
  worker_id: z.number().min(1),
  childs: z.array(WorkTripChildSchema),
  road: z.array(WorkTripRoadSchema),
  hotel: z.array(WorkTripHotelSchema)
})

export type WorkTripFormValues = z.infer<typeof WorkTripFormSchema>
export type WorkTripChildValues = z.infer<typeof WorkTripChildSchema>

export const WorkTripQueryKeys = {
  GetAll: 'work-trip/all',
  GetById: 'work-trip/by-id'
}

export const defaultValues: WorkTripFormValues = {
  minimum_wage_id: 0,
  doc_num: '',
  doc_date: '',
  from_date: '',
  to_date: '',
  day_summa: 0,
  hostel_summa: 0,
  road_summa: 0,
  summa: 0,
  comment: '',
  childs: [
    {
      schet_id: 0,
      summa: 0,
      type: 'day'
    },
    {
      schet_id: 0,
      summa: 0,
      type: 'hostel'
    },
    {
      schet_id: 0,
      summa: 0,
      type: 'road'
    }
  ] as WorkTripChildValues[],
  worker_id: 0,
  road: [
    {
      road_ticket_number: '',
      from_region_id: 0,
      to_region_id: 0,
      km: 0,
      road_summa: 0
    }
  ],
  hotel: [
    {
      hostel_ticket_number: '',
      day: 0,
      day_summa: 0,
      hostel_summa: 0
    }
  ]
}
