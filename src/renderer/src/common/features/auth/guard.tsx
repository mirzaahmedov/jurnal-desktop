import type { ReactNode } from 'react'

import { Navigate } from 'react-router-dom'

import { useAuthStore } from './store'

type AuthGuardProps = {
  children: ReactNode
}
export const AuthGuard = (props: AuthGuardProps) => {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? props.children : <Navigate to="/" />
}
