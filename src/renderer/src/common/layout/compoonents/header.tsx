import { Fragment } from 'react'

import { CaretRightIcon } from '@radix-ui/react-icons'
import { ArrowLeft, LogOut, Menu, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

import { Button } from '@/common/components/jolly/button'
import { Popover, PopoverDialog, PopoverTrigger } from '@/common/components/jolly/popover'
import { NewWindowLauncher } from '@/common/components/new-window-launcher'
import { Reload } from '@/common/components/reload'
import { useAuthenticationStore } from '@/common/features/auth'
import { Downloads } from '@/common/features/downloads-manager'
import { RequisitesController } from '@/common/features/requisites'
import { useElementWidth } from '@/common/hooks'
import { cn } from '@/common/lib/utils'

import { useLayoutStore } from '../store'
import { SelectedMonth } from './selected-month'
import { Settings } from './settings'
import { UserProfile } from './user-profile'

export const Header = () => {
  const { t } = useTranslation()
  const { title, content: Content, enableSaldo, breadcrumbs, onCreate, onBack } = useLayoutStore()
  const { user, setUser } = useAuthenticationStore()
  const { setElementRef, width } = useElementWidth()

  const location = useLocation()

  const handleLogout = () => {
    setUser(null)
  }

  return (
    <header
      ref={setElementRef}
      className="px-5 py-4 flex flex-wrap justify-start items-center gap-x-1 gap-y-5 border-b border-border/50 bg-white z-[51] sticky top-0"
    >
      {typeof onBack === 'function' ? (
        <Button
          variant="ghost"
          size="icon"
          onPress={onBack}
        >
          <ArrowLeft className="size-5" />
        </Button>
      ) : null}
      <div className="flex flex-col gap-1 mr-5">
        {Array.isArray(breadcrumbs) ? (
          <ul className="flex items-center gap-1">
            {breadcrumbs?.map((item) => (
              <Fragment key={item.title}>
                {item.path ? (
                  <Link
                    className="max-w-48 text-xs font-medium text-slate-500 hover:text-brand overflow-ellipsis whitespace-nowrap overflow-hidden"
                    to={item.path}
                  >
                    {item.title}
                  </Link>
                ) : (
                  <li className="max-w-48 text-xs font-medium text-slate-500 overflow-ellipsis whitespace-nowrap overflow-hidden">
                    {item.title}
                  </li>
                )}
                <CaretRightIcon className="text-slate-500" />
              </Fragment>
            ))}
          </ul>
        ) : null}

        <h1 className="text-base font-semibold">{title}</h1>
      </div>
      <div className="flex-1 flex items-center px-2 gap-2">
        <div className="flex-1">{Content && <Content key={location.pathname} />}</div>
        <div>
          {typeof onCreate === 'function' ? (
            <Button onPress={onCreate}>
              {t('add')}
              <Plus className={cn('btn-icon', width && width > 1305 && 'icon-end')} />
            </Button>
          ) : null}
        </div>
      </div>
      {enableSaldo ? <SelectedMonth className="mr-2" /> : null}
      {user && user?.role_name !== 'super-admin' ? <RequisitesController /> : null}
      {width && width > 1400 ? (
        <div className="flex items-center">
          <Settings />
          <Downloads />
          <Reload />
          <NewWindowLauncher />
        </div>
      ) : null}

      {width && width < 1400 ? (
        <PopoverTrigger>
          <Button
            variant="ghost"
            size="icon"
          >
            <Menu className="btn-icon icon-md" />
          </Button>
          <Popover>
            <PopoverDialog>
              <div className="flex items-center">
                <Settings />
                <Downloads />
                <Reload />
                <NewWindowLauncher />
              </div>
            </PopoverDialog>
          </Popover>
        </PopoverTrigger>
      ) : null}

      {user ? <UserProfile user={user} /> : null}
      <Button
        variant="ghost"
        size="icon"
        onPress={handleLogout}
      >
        <LogOut className="btn-icon icon-md" />
      </Button>
    </header>
  )
}
