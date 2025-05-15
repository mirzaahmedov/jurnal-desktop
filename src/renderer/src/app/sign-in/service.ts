import type { SigninFormValues, SigninResponse } from './config'
import type { ApiResponse } from '@/common/models'

import { http } from '@/common/lib/http'

export const signinQuery = async (payload: SigninFormValues) => {
  const res = await http.post<ApiResponse<SigninResponse>>('/auth', payload, {
    withCredentials: false
  })
  return res.data
}
