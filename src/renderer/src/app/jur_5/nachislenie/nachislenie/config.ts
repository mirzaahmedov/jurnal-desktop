import { z } from 'zod'

import { formatDate } from '@/common/lib/date'

export const NachislenieFormSchema = z.object({
  tabelMainId: z.number(),
  spravochnikBudjetNameId: z.number(),
  spravochnikOrganizationId: z.number(),
  mainSchetId: z.number(),
  nachislenieYear: z.number(),
  nachislenieMonth: z.number(),
  docNum: z.number(),
  docDate: z.string(),
  // Tabel fields
  rabDni: z.number(),
  otrabDni: z.number(),
  noch: z.number(),
  prazdnik: z.number(),
  pererabodka: z.number(),
  kazarma: z.number()
})
export type NachislenieFormValues = z.infer<typeof NachislenieFormSchema>

export const defaultValues: NachislenieFormValues = {
  tabelMainId: 0,
  spravochnikBudjetNameId: 0,
  spravochnikOrganizationId: 0,
  mainSchetId: 0,
  nachislenieYear: new Date().getFullYear(),
  nachislenieMonth: new Date().getMonth() + 1,
  docNum: 0,
  docDate: formatDate(new Date()),
  // Tabel default values
  rabDni: 0,
  otrabDni: 0,
  noch: 0,
  prazdnik: 0,
  pererabodka: 0,
  kazarma: 0
}
