import { z } from 'zod'

export const WorkTripProvodkaFormSchema = z.object({
  schet_id: z.number().min(1),
  summa: z.coerce.number(),
  type: z.enum(['day', 'hostel', 'road'])
})

export const WorkTripFormSchema = z.object({
  doc_num: z.string().nonempty(),
  doc_date: z.string().nonempty(),
  from_date: z.string().nonempty(),
  to_date: z.string().nonempty(),
  day_summa: z.coerce.number(),
  hostel_ticket_number: z.string(),
  hostel_summa: z.coerce.number(),
  from_district_id: z.number(),
  to_district_id: z.number(),
  road_ticket_number: z.string(),
  road_summa: z.coerce.number(),
  summa: z.coerce.number(),
  comment: z.string(),
  worker_id: z.number(),
  childs: z.array(WorkTripProvodkaFormSchema)
})

export type WorkTripFormValues = z.infer<typeof WorkTripFormSchema>
export type WorkTripProvodkaFormValues = z.infer<typeof WorkTripProvodkaFormSchema>

export const WorkTripQueryKeys = {
  GetAll: 'work-trip/all',
  GetById: 'work-trip/by-id'
}

export const defaultValues: WorkTripFormValues = {
  summa: 0,
  doc_num: '',
  doc_date: '',
  from_date: '',
  to_date: '',
  day_summa: 0,
  hostel_ticket_number: '',
  hostel_summa: 0,
  from_district_id: 0,
  to_district_id: 0,
  road_ticket_number: '',
  road_summa: 0,
  comment: '',
  worker_id: 0,
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
  ]
}
