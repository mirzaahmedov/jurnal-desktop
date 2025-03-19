import type { MainSchet } from '@/common/models'

import { Fragment, type ReactNode } from 'react'

import { CaretRightIcon } from '@radix-ui/react-icons'
import { RequisitesDialog, useRequisitesStore } from '@renderer/common/features/requisites'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, CirclePlus, LogOut, RefreshCw, Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

import { mainSchetQueryKeys, mainSchetService } from '@/app/region-spravochnik/main-schet'
import { Avatar, AvatarFallback } from '@/common/components/ui/avatar'
import { Button } from '@/common/components/ui/button'
import { ConfigureDefaultValuesDialog } from '@/common/features/app-defaults'
import { useAuthenticationStore } from '@/common/features/auth'
import { useToggle } from '@/common/hooks/use-toggle'

import { useLayoutStore } from './store'

type PageLayoutProps = {
  children: ReactNode
}
export const PageLayout = ({ children }: PageLayoutProps) => {
  const { t } = useTranslation()

  const { title, content: Content, breadcrumbs, onCreate, onBack } = useLayoutStore()
  const { user, setUser } = useAuthenticationStore()
  const { pathname } = useLocation()

  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)

  const mainSchetToggle = useToggle()
  const appDefaultsToggle = useToggle()

  const { data: main_schet_data } = useQuery({
    queryKey: [mainSchetQueryKeys.getById, main_schet_id],
    queryFn: mainSchetService.getById,
    enabled: !!main_schet_id
  })

  const main_schet = main_schet_data?.data

  const handleLogout = () => {
    setUser(null)
  }

  const schet = getCurrentSchet({ main_schet, pathname })

  return (
    <main className="h-full flex flex-col bg-white">
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
        <div className="flex-1 flex items-center">
          <div className="flex-1">{Content && <Content key={pathname} />}</div>
          <div>
            {typeof onCreate === 'function' ? (
              <Button onClick={onCreate}>
                <CirclePlus className="btn-icon" />
                {t('add')}
              </Button>
            ) : null}
          </div>
        </div>
        <div className="flex items-center divide-x">
          <div className="flex items-center gap-1 px-2.5 pr-5">
            <Button
              variant="ghost"
              size="icon"
              onClick={appDefaultsToggle.open}
            >
              <Settings />
            </Button>

            {user?.role_name !== 'super-admin' && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={mainSchetToggle.open}
                >
                  <RefreshCw />
                </Button>

                <div className="flex flex-col gap-0.5">
                  <p className="text-xs font-medium text-slate-500">{t('main-schet')}</p>
                  <p className="text-base font-semibold">
                    {[main_schet?.account_number, schet].filter((value) => !!value).join(' - ')}
                  </p>
                </div>
              </>
            )}
          </div>
          {user ? (
            <div className="px-5 flex items-center gap-4">
              <Avatar>
                <AvatarFallback className="bg-brand text-brand-foreground">
                  {user.fio
                    ?.split(' ')
                    .filter((w) => Boolean(w?.trim()))
                    .slice(0, 2)
                    .map((w) => w?.[0]?.toUpperCase())}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5">
                <h6 className="text-base font-semibold">{user?.fio}</h6>
                <p className="text-xs font-medium text-slate-500">
                  {[
                    user.region_name,
                    user.role_name === 'region-admin' ? 'Регион админ' : user.role_name
                  ].join(' - ')}
                </p>
              </div>
            </div>
          ) : null}
          <div className="pl-8 flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
            >
              <LogOut />
            </Button>
          </div>
        </div>
      </header>
      {children}
      <RequisitesDialog
        open={mainSchetToggle.isOpen}
        onOpenChange={mainSchetToggle.setOpen}
      />
      <ConfigureDefaultValuesDialog
        open={appDefaultsToggle.isOpen}
        onOpenChange={appDefaultsToggle.setOpen}
      />
    </main>
  )
}

type GetCurrentSchetParams = {
  main_schet?: MainSchet
  pathname: string
}
const getCurrentSchet = ({ main_schet, pathname }: GetCurrentSchetParams): string => {
  switch (true) {
    case !main_schet:
      return ''
    case pathname.startsWith('/kassa'):
      return main_schet.jur1_schet
    case pathname.startsWith('/bank'):
      return main_schet.jur2_schet
    case pathname.startsWith('/organization'):
      return main_schet.jur3_schet
    case pathname.startsWith('/accountable'):
      return main_schet.jur4_schet
    default:
      return ''
  }
}
