import { useTranslation } from 'react-i18next'

import { Badge } from '@/common/components/ui/badge'
import { MainbookStatus } from '@/common/models'

export type ReportStatusProps = { status: MainbookStatus }
export const ReportStatus = ({ status }: ReportStatusProps) => {
  const { t } = useTranslation()
  switch (status) {
    case MainbookStatus.SEND:
      return (
        <Badge
          variant="secondary"
          className="bg-slate-100 text-slate-500"
        >
          {t('sent')}
        </Badge>
      )
    case MainbookStatus.ACCEPT:
      return (
        <Badge
          variant="secondary"
          className="bg-emerald-100 text-emerald-500"
        >
          {t('recieved')}
        </Badge>
      )
    case MainbookStatus.REJECT:
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
