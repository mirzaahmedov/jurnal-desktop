import type { VideoModule } from '@/common/models'

import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { withPreprocessor } from '@/common/lib/validation'

export const VideoModuleFormSchema = withPreprocessor(
  z.object({
    name: z.string()
  })
)
export type VideoModuleFormValues = z.infer<typeof VideoModuleFormSchema>

export const videoModuleService = new CRUDService<VideoModule, VideoModuleFormValues>({
  endpoint: ApiEndpoints.admin_spravochnik_video_module
})
