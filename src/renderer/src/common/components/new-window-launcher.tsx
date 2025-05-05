import { useEffect } from 'react'

import { AppWindow } from 'lucide-react'
import { useLocation } from 'react-router-dom'

import { Button } from './jolly/button'

const getLocalStorageValues = () => {
  const values = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key) values[key] = localStorage.getItem(key)
  }
  return values
}
const getSessionStorageValues = () => {
  const values = {}
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i)
    if (key) values[key] = sessionStorage.getItem(key)
  }
  return values
}

export const NewWindowLauncher = () => {
  const location = useLocation()

  useEffect(() => {
    document.getElementById('splash-screen')?.classList.add('hidden')
  }, [])

  return (
    <Button
      variant="ghost"
      size="icon"
      onPress={() => {
        window.api.openRouteNewWindow({
          route: location.pathname,
          localStorage: getLocalStorageValues(),
          sessionStorage: getSessionStorageValues()
        })
      }}
    >
      <AppWindow className="btn-icon icon-md" />
    </Button>
  )
}
