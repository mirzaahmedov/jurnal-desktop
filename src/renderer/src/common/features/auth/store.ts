import type { RoleAccess, User } from '@/common/models'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type AuthStore = {
  isAuthenticated: boolean
  user?: User & { acesses: RoleAccess[] }
  token?: string
  deviceId?: string
  setUser(payload: Pick<AuthStore, 'user' | 'token' | 'deviceId'> | null): void
  setAuthenticated(isAuthenticated: boolean): void
}

export const useAuthStore = create<AuthStore>()(
  persist<AuthStore>(
    (set) => ({
      isAuthenticated: false,
      setUser: (payload) => {
        if (!payload || !payload.user || !payload.token) {
          return set({
            user: undefined,
            token: undefined,
            isAuthenticated: false,
            deviceId: undefined
          })
        }
        set({
          user: payload.user,
          token: payload.token,
          isAuthenticated: true,
          deviceId: payload.deviceId
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

export const getUserId = () => useAuthStore.getState()?.user?.id
