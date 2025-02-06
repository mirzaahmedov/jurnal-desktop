import type { Access, User } from '@/common/models'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type AuthenticationStore = {
  isAuthenticated: boolean
  user?: User & { access_object: Access }
  token?: string
  setUser(payload: Pick<AuthenticationStore, 'user' | 'token'> | null): void
}

export const useAuthenticationStore = create<AuthenticationStore>()(
  persist<AuthenticationStore>(
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
