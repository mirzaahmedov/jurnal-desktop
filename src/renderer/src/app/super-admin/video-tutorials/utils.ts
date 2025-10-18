import { useAuthStore } from '@/common/features/auth'
import { api } from '@/common/lib/http'

export interface GetVideoURLArgs {
  id: number
}
export const getVideoURL = ({ id }: GetVideoURLArgs) => {
  const { token } = useAuthStore.getState()
  return `${api.defaults.baseURL}/admin/video/watch/${id}?token=${token}`
}
