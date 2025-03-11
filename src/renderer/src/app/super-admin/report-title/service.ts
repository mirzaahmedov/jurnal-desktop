import type { ReportTitle } from '@/common/models'

import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { withPreprocessor } from '@/common/lib/validation'

export const ReportTitleFormSchema = withPreprocessor(
  z.object({
    name: z.string()
  })
)
export type ReportTitleFormValues = z.infer<typeof ReportTitleFormSchema>

export const reportTitleService = new CRUDService<ReportTitle, ReportTitleFormValues>({
  endpoint: ApiEndpoints.report_title
})
