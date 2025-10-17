import { z } from 'zod'

export const FeedbackFormSchema = z.object({
  user_id: z.number(),
  message: z.string(),
  file: z.any(),
  meta_data: z.string()
})
export type FeedbackForm = z.infer<typeof FeedbackFormSchema>
