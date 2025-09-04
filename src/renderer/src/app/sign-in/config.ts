import type { MainSchet, RoleAccess, User } from '@/common/models'

import { z } from 'zod'

export const SigninQueryKeys = {
  signin: 'auth/signin'
}

export const SigninFormSchema = z.object({
  login: z.string(),
  password: z.string()
})
export type SigninFormValues = z.infer<typeof SigninFormSchema>
export type SigninResponse = {
  token: string
  result: User & { access_object: RoleAccess }
  main_schet: MainSchet
}

export const defaultValues: SigninFormValues = {
  login: import.meta.env.DEV ? 'Тошкент ВФВБ' : '',
  password: import.meta.env.DEV ? '202560262' : ''
}
