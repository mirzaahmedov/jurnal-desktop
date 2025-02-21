import { formatDate } from '@renderer/common/lib/date'
import { withPreprocessor } from '@renderer/common/lib/validation'
import { DocumentOrientation } from '@renderer/common/widget/form'
import { z } from 'zod'

export const ReportDialogFormSchema = withPreprocessor(
  z.object({
    section: z.number(),
    subchapter: z.number(),
    chapter: z.number(),
    percentage: z.string(),
    summa_value: z.number(),
    payment_date: z.string(),
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
