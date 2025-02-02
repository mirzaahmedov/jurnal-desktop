import type { Access, User } from '@/common/models'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type AuthStoreType = {
  isAuthenticated: boolean
  user?: User & { access_object: Access }
  token?: string
  setUser(payload: Pick<AuthStoreType, 'user' | 'token'> | null): void
}

export const useAuthStore = create<AuthStoreType>()(
  persist<AuthStoreType>(
    (set) => ({
      isAuthenticated: false,
      setUser: (payload) => {
        if (!payload || !payload.user || !payload.token) {
          return set({
            user: undefined,
            token: undefined,
            isAuthenticated: false
          })
        }
        set({
          user: payload.user,
          token: payload.token,
          isAuthenticated: true
        })
      }
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)
