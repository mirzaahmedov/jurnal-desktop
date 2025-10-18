import { z } from 'zod'

import { ZarplataPodpisType } from '@/common/models/zarplata_podpis'

export const zarplataTypeOptions = [
  { value: ZarplataPodpisType.MonthlyVedemost },
  { value: ZarplataPodpisType.OtherVedemost },
  { value: ZarplataPodpisType.OtdelniyRaschet },
  { value: ZarplataPodpisType.VedemostShapka }
]

export const ZarplataPodpisFormSchema = z.object({
  position: z.string(),
  fio: z.string(),
  type: z.enum([
    ZarplataPodpisType.MonthlyVedemost,
    ZarplataPodpisType.OtherVedemost,
    ZarplataPodpisType.OtdelniyRaschet,
    ZarplataPodpisType.VedemostShapka
  ])
})
export type ZarplataPodpisForm = z.infer<typeof ZarplataPodpisFormSchema>
