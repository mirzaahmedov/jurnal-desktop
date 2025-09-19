import type { MaterialProductHistory, MaterialSaldoProduct } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { Trans, useTranslation } from 'react-i18next'

import { type ColumnDef, Copyable, GenericTable } from '@/common/components'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { LabeledValue } from '@/common/components/labeled-value'
import { Badge } from '@/common/components/ui/badge'
import { formatLocaleDate, formatNumber } from '@/common/lib/format'

export interface MaterialProductDetailsProps extends Omit<DialogTriggerProps, 'children'> {
  data: MaterialSaldoProduct
}
export const MaterialProductDetailsDialog = ({ data, ...props }: MaterialProductDetailsProps) => {
  const { t } = useTranslation(['app'])

  const history = data.history ?? []

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="w-full max-w-9xl">
          <div className="h-full flex flex-col gap-5">
            <DialogHeader>
              <DialogTitle>{t('material_product_history')}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 flex flex-col gap-5">
              <div className="flex items-center gap-10">
                <LabeledValue
                  label={t('id')}
                  value={<Copyable value={data.product_id}>#{data.product_id}</Copyable>}
                />
                <LabeledValue
                  label={t('name')}
                  value={data.name}
                  className="w-full max-w-md"
                />
                <LabeledValue
                  label={t('kol')}
                  value={formatNumber(data.to?.kol || 0)}
                />
                <LabeledValue
                  label={t('sena')}
                  value={formatNumber(data.to?.sena || 0)}
                />
                <LabeledValue
                  label={t('summa')}
                  value={formatNumber(data.to?.summa || 0)}
                />
                <LabeledValue
                  label={t('prixod_date')}
                  value={data.prixodData?.map((item) => formatLocaleDate(item.docDate)) || 0}
                />
                <LabeledValue
                  label={t('type')}
                  value={<Trans>{data.type}</Trans>}
                />
              </div>
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
