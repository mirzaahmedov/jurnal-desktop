import { z } from 'zod'
import { withPreprocessor } from '@/common/lib/validation'
import { formatDate } from '@/common/lib/date'

const ReportDialogPayloadSchema = withPreprocessor(
  z.object({
    section: z.number(),
    subchapter: z.number(),
    chapter: z.number(),
    percentage: z.string(),
    summa_value: z.number(),
    payment_date: z.string(),
    payment_details: z.string(),
    contract_details: z.string()
  })
)
type ReportDialogPayloadType = z.infer<typeof ReportDialogPayloadSchema>

const defaultValues: ReportDialogPayloadType = {
  section: 0,
  subchapter: 0,
  chapter: 0,
  percentage: '30',
  summa_value: 0,
  payment_date: formatDate(new Date()),
  payment_details: '',
  contract_details: ''
}

export { ReportDialogPayloadSchema, defaultValues }
export type { ReportDialogPayloadType }
