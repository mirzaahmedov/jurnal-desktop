import { Access } from '@/common/models'

import { useAuthenticationStore } from './store'

export const useAccess = (key: keyof Access) => {
  const { user } = useAuthenticationStore()
  const access = user?.access_object[key] ?? false

  return {
    access
  }
}
