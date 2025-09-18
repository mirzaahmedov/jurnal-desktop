import type { MaterialProductHistory } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { Trans, useTranslation } from 'react-i18next'

import { type ColumnDef, GenericTable } from '@/common/components'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Badge } from '@/common/components/ui/badge'

export interface MaterialProductHistoryDialogProps extends Omit<DialogTriggerProps, 'children'> {
  history: MaterialProductHistory[]
}
export const MaterialProductHistoryDialog = ({
  history = [],
  ...props
}: MaterialProductHistoryDialogProps) => {
  const { t } = useTranslation(['app'])

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="w-full max-w-7xl">
          <div className="h-full flex flex-col gap-5">
            <DialogHeader>
              <DialogTitle>{t('material_product_history')}</DialogTitle>
            </DialogHeader>
            <div className="flex-1">
              <GenericTable
                data={history}
                columnDefs={MaterialProductHistoryColumnDefs}
                className="table-generic-xs"
              />
            </div>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}

const MaterialProductHistoryColumnDefs: ColumnDef<MaterialProductHistory>[] = [
  {
    key: 'from',
    header: 'from-who'
  },
  {
    key: 'to',
    header: 'to-whom'
  },
  {
    key: 'type',
    renderCell: (row) => (
      <Badge>
        <Trans>{row.type}</Trans>
      </Badge>
    )
  },
  {
    key: 'kol'
  },
  {
    key: 'summa'
  }
]
