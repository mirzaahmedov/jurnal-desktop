import type { MainSchet } from '@/common/models'

import { useTranslation } from 'react-i18next'

import { useToggle } from '@/common/hooks'

export interface MainSchetInfoProps {
  main_schet?: MainSchet
  schet?: string
}
export const MainSchetInfo = ({ main_schet, schet }: MainSchetInfoProps) => {
  const mainSchetInfoToggle = useToggle()

  const { t } = useTranslation()

  return (
    <div
      className="flex flex-col gap-0.5 cursor-pointer"
      onClick={main_schet ? mainSchetInfoToggle.open : undefined}
    >
      <p className="text-xs font-medium text-slate-500">{t('main-schet')}</p>
      <p className="text-base font-semibold">
        {[main_schet?.account_number, schet].filter((value) => !!value).join(' - ')}
      </p>
    </div>
  )
}
