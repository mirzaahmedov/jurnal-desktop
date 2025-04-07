import { CircleAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'

import { useRequisitesStore } from './store'

export const MainSchetSelectedGuard = () => {
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const { t } = useTranslation()

  if (!main_schet_id) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <CircleAlert className="size-20 text-slate-500" />
          <h1 className="text-slate-500 text-base font max-w-md text-center">
            {t('no_main_schet')}
          </h1>
        </div>
      </div>
    )
  }

  return <Outlet />
}
