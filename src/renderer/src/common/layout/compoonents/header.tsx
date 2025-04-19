import { Fragment } from 'react'

import { CaretRightIcon } from '@radix-ui/react-icons'
import { ArrowLeft, LogOut, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

import { Button } from '@/common/components/ui/button'
import { useAuthenticationStore } from '@/common/features/auth'
import { RequisitesController } from '@/common/features/requisites'

import { useLayoutStore } from '../store'
import { SelectedMonth } from './selected-month'
import { Settings } from './settings'
import { UserProfile } from './user-profile'

export const Header = () => {
  const { t } = useTranslation()
  const {
    title,
    content: Content,
    isSelectedMonthVisible,
    breadcrumbs,
    onCreate,
    onBack
  } = useLayoutStore()
  const { user, setUser } = useAuthenticationStore()

  const location = useLocation()

  const handleLogout = () => {
    setUser(null)
  }

  return (
    <header className="px-5 py-4 flex justify-between border-b border-border/50 bg-white z-[51] sticky top-0">
      <div className="flex items-center gap-2.5">
        {typeof onBack === 'function' ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
          >
            <ArrowLeft className="size-5" />
          </Button>
        ) : null}
        <div className="flex flex-col gap-1.5">
          {Array.isArray(breadcrumbs) ? (
            <ul className="flex items-center gap-1">
              {breadcrumbs?.map((item) => (
                <Fragment key={item.title}>
                  {item.path ? (
                    <Link
                      className="text-xs font-medium text-slate-500 hover:text-brand"
                      to={item.path}
                    >
                      {item.title}
                    </Link>
                  ) : (
                    <li className="text-xs font-medium text-slate-500">{item.title}</li>
                  )}
                  <CaretRightIcon className="text-slate-500" />
                </Fragment>
              ))}
            </ul>
          ) : null}

          <h1 className="text-base font-semibold">{title}</h1>
        </div>
      </div>
      <div className="flex-1 flex items-center px-5 gap-5">
        <div className="flex-1">{Content && <Content key={location.pathname} />}</div>
        <div>
          {typeof onCreate === 'function' ? (
            <Button onClick={onCreate}>
              {t('add')}
              <Plus className="btn-icon" />
            </Button>
          ) : null}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isSelectedMonthVisible ? (
          <div className="pr-2.5">
            <SelectedMonth />
          </div>
        ) : null}
        <RequisitesController />
        {user ? <UserProfile user={user} /> : null}
        <Settings />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
        >
          <LogOut />
        </Button>
      </div>
    </header>
  )
}
