import type { SigninForm, SigninResponse } from './config'
import type { Response } from '@/common/models'

import { http } from '@/common/lib/http'

const signinQuery = async (payload: SigninForm) => {
  const res = await http.post<Response<SigninResponse>>('/auth', payload, {
    withCredentials: false
  })
  return res.data
}

export { signinQuery }
