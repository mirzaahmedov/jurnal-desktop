import { useEffect } from 'react'

import { AppWindow } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import { Button } from './jolly/button'
import { Tooltip, TooltipTrigger } from './jolly/tooltip'

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
  const { t } = useTranslation(['app'])

  useEffect(() => {
    document.getElementById('splash-screen')?.classList.add('hidden')
  }, [])

  return (
    <TooltipTrigger delay={300}>
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
      <Tooltip>{t('app.open_in_new_window')}</Tooltip>
    </TooltipTrigger>
  )
}
