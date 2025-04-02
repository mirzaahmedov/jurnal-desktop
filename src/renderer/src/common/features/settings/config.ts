import { z } from 'zod'

export const SettingsFormSchema = z.object({
  default_start_date: z.string(),
  default_end_date: z.string(),
  language: z.string(),
  zoom: z.number(),
  report_title_id: z.number().optional()
})
export type SettingsFormValues = z.infer<typeof SettingsFormSchema>
