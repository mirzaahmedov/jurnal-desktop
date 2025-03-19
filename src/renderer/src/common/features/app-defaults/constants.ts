import { z } from 'zod'

export const ConfigureDefaultValuesPayloadSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  language: z.string(),
  zoomFactor: z.number(),
  report_title_id: z.number().optional()
})
export type ConfigureDefaultValuesPayloadType = z.infer<typeof ConfigureDefaultValuesPayloadSchema>
