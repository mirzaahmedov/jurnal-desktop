import type { SigninFormValues, SigninResponse } from './config'
import type { ApiResponse } from '@/common/models'

import { api } from '@/common/lib/http'

export const signinQuery = async (payload: SigninFormValues) => {
  const res = await api.post<ApiResponse<SigninResponse>>('/auth', payload, {
    withCredentials: false
  })
  return res.data
}
export interface SigninUSBFormValues {
  hash: string
}
export const signinUSBQuery = async ({ hash }: SigninUSBFormValues) => {
  const res = await api.post<ApiResponse<SigninResponse>>(
    '/auth/login-usb',
    { hash },
    {
      withCredentials: false
    }
  )
  return res.data
}
