import { ReactNode } from 'react'

import { Navigate } from 'react-router-dom'

import { useAuthenticationStore } from './store'

type AuthGuardProps = {
  children: ReactNode
}
export const AuthGuard = (props: AuthGuardProps) => {
  const { isAuthenticated } = useAuthenticationStore()
  return isAuthenticated ? props.children : <Navigate to="/signin" />
}
