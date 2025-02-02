import { FC } from 'react'

import { Badge } from '@renderer/common/components/ui/badge'
import { Mainbook } from '@renderer/common/models'

export type ReportStatusProps = { status: Mainbook.Status }
export const ReportStatus: FC<ReportStatusProps> = ({ status }) => {
  switch (status) {
    case Mainbook.Status.SENT:
      return (
        <Badge
          variant="secondary"
          className="bg-slate-100 text-slate-500"
        >
          Отправлено
        </Badge>
      )
    case Mainbook.Status.ACCEPTED:
      return (
        <Badge
          variant="secondary"
          className="bg-emerald-100 text-emerald-500"
        >
          Получено
        </Badge>
      )
    case Mainbook.Status.REJECTED:
      return (
        <Badge
          variant="secondary"
          className="bg-red-100 text-red-500"
        >
          Отказано
        </Badge>
      )
  }
}
