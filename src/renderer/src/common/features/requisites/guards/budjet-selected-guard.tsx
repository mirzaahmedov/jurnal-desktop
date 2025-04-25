import { useEffect } from 'react'

import { RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'

import { LockedContent } from '@/common/assets/illustrations/locked-content'
import { Button } from '@/common/components/jolly/button'
import { useToggle } from '@/common/hooks'
import { useLayout } from '@/common/layout'

import { RequisitesDialog } from '../dialog'
import { useRequisitesStore } from '../store'

export const BudjetSelectedGuard = () => {
  const dialogToggle = useToggle()
  const setLayout = useLayout()
  const budjet_id = useRequisitesStore((store) => store.budjet_id)

  const { t } = useTranslation()

  useEffect(() => {
    if (!budjet_id) {
      setLayout({
        title: ''
      })
    }
  }, [budjet_id, setLayout])

  if (!budjet_id) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <LockedContent className="h-96 text-slate-500" />
          <h1 className="text-slate-500 text-base font max-w-md text-center">{t('no_budjet')}</h1>
          <Button onPress={dialogToggle.open}>
            <RefreshCw className="btn-icon icon-start" /> {t('budjet')}
          </Button>
        </div>
        <RequisitesDialog
          isOpen={dialogToggle.isOpen}
          onOpenChange={dialogToggle.setOpen}
        />
      </div>
    )
  }

  return <Outlet />
}
