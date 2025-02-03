import type { FC } from 'react'

import { Badge } from '@renderer/common/components/ui/badge'
import { Mainbook } from '@renderer/common/models'
import { useTranslation } from 'react-i18next'

export type ReportStatusProps = { status: Mainbook.Status }
export const ReportStatus: FC<ReportStatusProps> = ({ status }) => {
  const { t } = useTranslation()
  switch (status) {
    case Mainbook.Status.SENT:
      return (
        <Badge
          variant="secondary"
          className="bg-slate-100 text-slate-500"
        >
          {t('sent')}
        </Badge>
      )
    case Mainbook.Status.ACCEPTED:
      return (
        <Badge
          variant="secondary"
          className="bg-emerald-100 text-emerald-500"
        >
          {t('recieved')}
        </Badge>
      )
    case Mainbook.Status.REJECTED:
      return (
        <Badge
          variant="secondary"
          className="bg-red-100 text-red-500"
        >
          {t('rejected')}
        </Badge>
      )
  }
}
