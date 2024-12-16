import { Navigate } from 'react-router-dom'
import { useAuthStore } from './store'
import { ReactNode } from 'react'

type AuthGuardProps = {
  children: ReactNode
}
export const AuthGuard = (props: AuthGuardProps) => {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? props.children : <Navigate to="/signin" />
}
