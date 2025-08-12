import type { ApiResponse, Video, VideoModule } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { http } from '@/common/lib/http'
import { withPreprocessor } from '@/common/lib/validation'

export const VideoModuleFormSchema = withPreprocessor(
  z.object({
    name: z.string(),
    status: z.boolean()
  })
)
export type VideoModuleFormValues = z.infer<typeof VideoModuleFormSchema>

export const VideoFormSchema = z.object({
  name: z.string().nonempty(),
  sort_order: z.coerce.number()
})
export type VideoFormValues = z.infer<typeof VideoFormSchema>

export const VideoModuleService = new CRUDService<VideoModule, VideoModuleFormValues>({
  endpoint: ApiEndpoints.admin_video_module
})

export class VideoService {
  static async getAll(ctx: QueryFunctionContext<[string, { module_id: number }]>) {
    const { module_id } = ctx.queryKey[1] ?? {}
    const res = await http.get<ApiResponse<Video[]>>(ApiEndpoints.admin_video, {
      params: {
        module_id
      }
    })
    return res.data
  }
  static async create(values: FormData) {
    const res = await http.post<ApiResponse<Video>>(ApiEndpoints.admin_video, values)
    return res.data
  }
  static async update(args: { id: number; values: FormData }) {
    const { id, values } = args
    const res = await http.put<ApiResponse<Video>>(`${ApiEndpoints.admin_video}/${id}`, values)
    return res.data
  }
  static async delete(args: { id: number }) {
    const { id } = args
    const res = await http.delete<ApiResponse<Video>>(`${ApiEndpoints.admin_video}/${id}`)
    return res.data
  }
}
