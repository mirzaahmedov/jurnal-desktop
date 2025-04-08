import { Fragment } from 'react'

import { CaretRightIcon } from '@radix-ui/react-icons'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, LogOut, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

import { mainSchetQueryKeys, mainSchetService } from '@/app/region-spravochnik/main-schet'
import { Button } from '@/common/components/ui/button'
import { useAuthenticationStore } from '@/common/features/auth'
import { useRequisitesStore } from '@/common/features/requisites'
import { useLayoutStore } from '@/common/layout/store'

import { Requisites } from './requisites'
import { SelectedMonth } from './selected-month'
import { Settings } from './settings'
import { UserProfile } from './user-profile'

export const Header = () => {
  const { t } = useTranslation()

  const { title, content: Content, breadcrumbs, onCreate, onBack } = useLayoutStore()
  const { user, setUser } = useAuthenticationStore()
  const { pathname } = useLocation()

  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)

  const { data } = useQuery({
    queryKey: [mainSchetQueryKeys.getById, main_schet_id],
    queryFn: mainSchetService.getById,
    enabled: !!main_schet_id
  })

  const main_schet = data?.data

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
        <div className="flex-1">{Content && <Content key={pathname} />}</div>
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
        <div className="pr-2.5">
          <SelectedMonth />
        </div>
        <Requisites
          data={main_schet}
          pathname={pathname}
        />
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
