import { z } from 'zod'

export const VacantFormSchema = z.object({
  name: z.string().nonempty(),
  parentId: z.number().optional().nullable()
})
export type VacantFormValues = z.infer<typeof VacantFormSchema>

export const defaultValues: VacantFormValues = {
  name: '',
  parentId: undefined
}
