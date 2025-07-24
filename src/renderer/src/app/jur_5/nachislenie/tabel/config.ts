import { z } from 'zod'

import { formatDate } from '@/common/lib/date'

export const TabelProvodkaFormSchema = z.object({
  vacantId: z.number(),
  mainZarplataId: z.number(),
  fio: z.string().optional(),
  doljnost: z.string().optional(),
  rabDni: z.number().optional(),
  otrabDni: z.number().optional(),
  noch: z.number().optional(),
  prazdnik: z.number().optional(),
  pererabodka: z.number().optional(),
  kazarma: z.number().optional()
})
export const TabelFormSchema = z.object({
  spravochnikBudjetNameId: z.number(),
  mainSchetId: z.number(),
  tabelYear: z.number(),
  tabelMonth: z.number(),
  docNum: z.number(),
  docDate: z.string().nonempty(),
  tabelChildren: z.array(TabelProvodkaFormSchema)
})
export type TabelFormValues = z.infer<typeof TabelFormSchema>
export type TabelProvodkaFormValues = z.infer<typeof TabelProvodkaFormSchema>

export const defaultValues: TabelFormValues = {
  spravochnikBudjetNameId: 0,
  mainSchetId: 0,
  tabelYear: new Date().getFullYear(),
  tabelMonth: new Date().getMonth() + 1,
  docNum: 0,
  docDate: formatDate(new Date()),
  tabelChildren: []
}

export const defaultProvodkaValues = {
  mainZarplataId: 0,
  rabDni: 0,
  otrabDni: 0,
  noch: 0,
  prazdnik: 0,
  pererabodka: 0,
  kazarma: 0
}
