import { z } from 'zod'

export const DismissEmployeeFormSchema = z.object({
  mainId: z.number(),
  doljnost: z.string(),
  prikazFinish: z.string(),
  dateFinish: z.string()
})
export type DismissEmployeeFormValues = z.infer<typeof DismissEmployeeFormSchema>

export const defaultDismissEmployeeValues: DismissEmployeeFormValues = {
  mainId: 0,
  doljnost: '',
  prikazFinish: '',
  dateFinish: ''
}
