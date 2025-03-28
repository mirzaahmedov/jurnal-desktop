import { useAuthenticationStore } from '@/common/features/auth'
import { http } from '@/common/lib/http'

export interface GetVideoURLArgs {
  id: number
}
export const getVideoURL = ({ id }: GetVideoURLArgs) => {
  const { token } = useAuthenticationStore.getState()
  return `${http.defaults.baseURL}/admin/video/watch/${id}?token=${token}`
}
