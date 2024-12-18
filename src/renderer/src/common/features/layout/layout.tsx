import type { ReactNode } from 'react'

import { Button } from '@/common/components/ui/button'
import { ArrowLeft, CirclePlus, LogOut, RefreshCw, Settings } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/common/components/ui/avatar'
import { MainSchetDialog, useMainSchet } from '@/common/features/main-schet'
import { useAuthStore } from '@/common/features/auth'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayoutStore } from './store'
import { useLocation } from 'react-router-dom'
import { MainSchet } from '@/common/models'
import { useQuery } from '@tanstack/react-query'
import { mainSchetQueryKeys, mainSchetService } from '@/app/region-spravochnik/main-schet'
import { ConfigureDefaultValuesDialog } from '@/common/features/app-defaults'

type PageLayoutProps = {
  children: ReactNode
}
export const PageLayout = (props: PageLayoutProps) => {
  const { children } = props

  const { title, content: Content, onCreate, onBack } = useLayoutStore()
  const { user, setUser } = useAuthStore()
  const { pathname } = useLocation()

  const main_schet_id = useMainSchet((store) => store.main_schet?.id)

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
        <div className="flex items-center gap-5">
          {typeof onBack === 'function' ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
            >
              <ArrowLeft className="size-5" />
            </Button>
          ) : null}
          <h1 className="text-xl">{title}</h1>
        </div>
        <div className="flex-1 flex items-center">
          <div className="flex-1">{Content && <Content />}</div>
          <div>
            {typeof onCreate === 'function' ? (
              <Button onClick={onCreate}>
                <CirclePlus className="btn-icon icon-start" />
                Добавить
              </Button>
            ) : null}
          </div>
        </div>
        <div className="flex items-center divide-x">
          <div className="flex items-center gap-1 px-8">
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
                  <p className="text-xs font-medium text-slate-500">Основной счет</p>
                  <p className="text-base font-semibold">
                    {[main_schet?.account_number, schet].filter((value) => !!value).join(' - ')}
                  </p>
                </div>
              </>
            )}
          </div>
          {user ? (
            <div className="px-8 flex items-center gap-4">
              <Avatar>
                <AvatarFallback className="bg-brand text-brand-foreground">
                  {user.fio.split(' ').map((w) => w[0].toUpperCase())}
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
      <MainSchetDialog
        open={mainSchetToggle.isOpen}
        onOpenChange={mainSchetToggle.setIsOpen}
      />
      <ConfigureDefaultValuesDialog
        open={appDefaultsToggle.isOpen}
        onClose={appDefaultsToggle.close}
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
