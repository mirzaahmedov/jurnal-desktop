import { http } from '@renderer/common/lib/http'

export interface GetVideoURLArgs {
  id: number
}
export const getVideoURL = ({ id }: GetVideoURLArgs) => {
  return `${http.defaults.baseURL}/admin/video/watch/${id}`
}
