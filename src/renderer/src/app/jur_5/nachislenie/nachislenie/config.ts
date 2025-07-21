import { z } from 'zod'

import { formatDate } from '@/common/lib/date'

export const NachislenieFormSchema = z.object({
  tabelMainId: z.number(),
  spravochnikBudjetNameId: z.number(),
  mainSchetId: z.number(),
  nachislenieYear: z.number(),
  nachislenieMonth: z.number(),
  docNum: z.number(),
  docDate: z.string()
})
export type NachislenieFormValues = z.infer<typeof NachislenieFormSchema>

export const defaultValues: NachislenieFormValues = {
  tabelMainId: 0,
  spravochnikBudjetNameId: 0,
  mainSchetId: 0,
  nachislenieYear: new Date().getFullYear(),
  nachislenieMonth: new Date().getMonth() + 1,
  docNum: 0,
  docDate: formatDate(new Date())
}
