import { z } from 'zod'

export const Jur8MonitorFormSchema = z.object({
  doc_num: z.string(),
  doc_date: z.string(),
  doc_id: z.number(),
  schet: z.string(),
  summa: z.number(),
  document_id: z.number(),
  type_doc: z.string(),
  rasxod_schet: z.string(),
  schet_id: z.number()
})
export type Jur8MonitorFormValues = z.infer<typeof Jur8MonitorFormSchema>
