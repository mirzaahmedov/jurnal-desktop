import { z } from 'zod'

export const OdinoxFormSchema = z.object({
  year: z.number(),
  month: z.number(),
  childs: z.array(
    z.object({
      name: z.string(),
      number: z.string()
    })
  )
})
export type OdinoxFormValues = z.infer<typeof OdinoxFormSchema>

export const defaultValues: OdinoxFormValues = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  childs: []
}
