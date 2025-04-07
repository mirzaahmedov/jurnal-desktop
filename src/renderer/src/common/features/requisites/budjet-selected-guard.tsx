import { CircleAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'

import { useRequisitesStore } from './store'

export const BudjetSelectedGuard = () => {
  const { t } = useTranslation()
  const budjet_id = useRequisitesStore((store) => store.budjet_id)

  if (!budjet_id) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <CircleAlert className="size-20 text-slate-500" />
          <h1 className="text-slate-500 text-base font max-w-md text-center">{t('no_budjet')}</h1>
        </div>
      </div>
    )
  }

  return <Outlet />
}
