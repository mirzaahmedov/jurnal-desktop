import { z } from 'zod'

export const PrivilegeFormSchema = z.object({
  name: z.string(),
  description: z.string(),
  summa: z.number().min(0),
  mainZarplataId: z.number().min(0).optional().nullable(),
  isRaschet: z.boolean()
})
export type PrivilegeFormValues = z.infer<typeof PrivilegeFormSchema>

export const defaultValues: PrivilegeFormValues = {
  name: '',
  description: '',
  summa: 0,
  isRaschet: false
}
