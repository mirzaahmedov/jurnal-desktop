import type { MainSchet, RoleAccess, User } from '@/common/models'

import { z } from 'zod'

const queryKeys = {
  signin: 'auth/signin'
}

const SigninFormSchema = z.object({
  login: z.string(),
  password: z.string(),
  main_schet_id: z.number().optional()
})
type SigninForm = z.infer<typeof SigninFormSchema>
type SigninResponse = {
  token: string
  result: User & { access_object: RoleAccess }
  main_schet: MainSchet
}

const defaultValues: SigninForm = {
  login: '',
  password: '',
  main_schet_id: 0
}

export { queryKeys, SigninFormSchema, defaultValues }
export type { SigninForm, SigninResponse }
