import type { RoleAccess, User } from '@/common/models'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type AuthenticationStore = {
  isAuthenticated: boolean
  user?: User & { acesses: RoleAccess[] }
  token?: string
  setUser(payload: Pick<AuthenticationStore, 'user' | 'token'> | null): void
  setAuthenticated(isAuthenticated: boolean): void
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
      },
      setAuthenticated: (isAuthenticated) => {
        set({ isAuthenticated })
      }
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)

export const getUserId = () => useAuthenticationStore.getState()?.user?.id
