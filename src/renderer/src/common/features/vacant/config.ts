import { z } from 'zod'

export const VacantFormSchema = z.object({
  name: z.string().nonempty(),
  parentId: z.number().optional().nullable(),
  number: z.number(),
  spravochnikBudjetNameId: z.number().optional()
})
export type VacantFormValues = z.infer<typeof VacantFormSchema>

export const defaultValues: VacantFormValues = {
  name: '',
  parentId: undefined,
  number: 0,
  spravochnikBudjetNameId: 0
}
