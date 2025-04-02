import { z } from 'zod'

export const PrixodbookFormSchema = z.object({
  year: z.number(),
  month: z.number(),
  childs: z.array(
    z.object({
      schet: z.string()
    })
  )
})
export type PrixodbookFormValues = z.infer<typeof PrixodbookFormSchema>

export const defaultValues: PrixodbookFormValues = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  childs: []
}
