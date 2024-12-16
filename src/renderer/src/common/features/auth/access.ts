import { Access } from '@/common/models'
import { useAuthStore } from './store'

export const useAccess = (key: keyof Access) => {
  const { user } = useAuthStore()
  const access = user?.access_object[key] ?? false

  return {
    access
  }
}
