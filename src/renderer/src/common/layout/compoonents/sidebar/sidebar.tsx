import { useEffect, useState } from 'react'

import logo from '@resources/logo.svg'
import { ChevronsLeft, ChevronsRight, RefreshCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Spinner } from '@/common/components'
import { Badge } from '@/common/components/ui/badge'
import { Button } from '@/common/components/ui/button'
import { useUpdateManagerStore } from '@/common/features/update-manager'
import { cn } from '@/common/lib/utils'

import { Navigation } from './navigation'
import { useSidebarStore } from './store'

export const Sidebar = () => {
  const [version, setVersion] = useState('')

  const { t } = useTranslation(['app'])
  const { isCollapsed, toggleCollapsed } = useSidebarStore()
  const { isAvailable, isRestarting, setRestarting } = useUpdateManagerStore()

  const handleRestart = async () => {
    setRestarting(true)
    window.api.quitAndInstall()
  }

  useEffect(() => {
    window.electron.ipcRenderer.invoke('get-version').then(setVersion)
  }, [])

  return (
    <aside
      className="w-full max-w-[300px] h-full flex flex-col border-r border-slate-200"
      style={{
        maxWidth: isCollapsed ? 112 : undefined
      }}
    >
      <div
        className={cn(
          'flex items-center justify-between p-5 gap-2.5 text-sm bg-white border-b border-slate-200 z-10',
          isCollapsed && 'flex-col-reverse'
        )}
      >
        <img
          src={logo}
          alt={t('title')}
          className="max-h-16"
        />
        {!isCollapsed ? <h1 className="flex-1 text-xs font-bold">{t('title')}</h1> : null}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapsed}
          className="text-slate-500"
        >
          {isCollapsed ? <ChevronsRight className="size-5" /> : <ChevronsLeft className="size-5" />}
        </Button>
      </div>
      <div className="h-full flex-1 flex flex-col overflow-y-auto scrollbar">
        <Navigation isCollapsed={isCollapsed} />
      </div>
      <div
        className={cn(
          'flex flex-col items-center p-5 gap-2 justify-center border-t',
          isCollapsed && 'px-1'
        )}
      >
        <ApplicationBadge />
        <p className="text-xs text-slate-500 font-medium">
          {!isCollapsed && t('title_short')} v.{version}
          {import.meta.env.VITE_MODE === 'region' ? t('region') : ''}
        </p>
      </div>
      {isAvailable ? (
        <Button
          className="h-12 w-full rounded-none flex items-center gap-2"
          onClick={handleRestart}
          disabled={isRestarting}
        >
          {isRestarting ? (
            <Spinner className="mr-2 inline-block size-4 border-white border-2 border-r-transparent" />
          ) : (
            <RefreshCcw className="btn-icon" />
          )}
          {t('update_and_restart')}
        </Button>
      ) : null}
    </aside>
  )
}

const ApplicationBadge = () => {
  const { t } = useTranslation(['app'])
  switch (true) {
    case import.meta.env.DEV:
      return <Badge>{t('development')}</Badge>
    case import.meta.env.VITE_MODE === 'staging':
      return <Badge className="bg-rose-500">{t('testing')}</Badge>
    default:
      return null
  }
}
