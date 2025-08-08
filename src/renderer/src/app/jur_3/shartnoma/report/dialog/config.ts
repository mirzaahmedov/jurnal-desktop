import { z } from 'zod'

import { formatDate } from '@/common/lib/date'
import { withPreprocessor } from '@/common/lib/validation'
import { DocumentOrientation } from '@/common/widget/form'

export const ReportDialogFormSchema = withPreprocessor(
  z.object({
    section: z.number().optional(),
    subchapter: z.number().optional(),
    chapter: z.number().optional(),
    percentage: z.string(),
    summa_value: z.number(),
    payment_date: z.string().optional(),
    payment_details: z.string(),
    contract_details: z.string(),
    orientation: z.enum([DocumentOrientation.LANDSCAPE, DocumentOrientation.PORTRAIT]),
    paddingLeft: z.number(),
    paddingTop: z.number(),
    paddingRight: z.number(),
    paddingBottom: z.number(),
    singlePage: z.boolean()
  })
)
export type ReportDialogFormValues = z.infer<typeof ReportDialogFormSchema>

export const defaultValues: ReportDialogFormValues = {
  section: 0,
  subchapter: 0,
  chapter: 0,
  percentage: '30',
  summa_value: 0,
  payment_date: formatDate(new Date()),
  payment_details: '',
  contract_details: '',
  orientation: DocumentOrientation.LANDSCAPE,
  paddingLeft: 10,
  paddingTop: 10,
  paddingRight: 10,
  paddingBottom: 10,
  singlePage: true
}
