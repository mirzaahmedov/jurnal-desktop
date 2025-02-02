import type { ShartnomaGrafik, ShartnomaGrafikDetails } from '@/common/models'

import { z } from 'zod'

import { APIEndpoints, CRUDService } from '@/common/features/crud'
import { budjet } from '@/common/features/crud/middleware'

export const shartnomaGrafikService = new CRUDService<ShartnomaGrafik, ShartnomaGrafikForm>({
  endpoint: APIEndpoints.shartnoma_grafik
}).use(budjet())
export const shartnomaGrafikDetailsService = new CRUDService<
  ShartnomaGrafikDetails,
  ShartnomaGrafikForm
>({
  endpoint: APIEndpoints.shartnoma_grafik
}).use(budjet())

export const ShartnomaGrafikFormSchema = z.object({
  oy_1: z.number(),
  oy_2: z.number(),
  oy_3: z.number(),
  oy_4: z.number(),
  oy_5: z.number(),
  oy_6: z.number(),
  oy_7: z.number(),
  oy_8: z.number(),
  oy_9: z.number(),
  oy_10: z.number(),
  oy_11: z.number(),
  oy_12: z.number()
})

export type ShartnomaGrafikForm = z.infer<typeof ShartnomaGrafikFormSchema>
