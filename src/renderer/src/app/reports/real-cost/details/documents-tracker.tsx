import type { RealCostDocument } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { t } from 'i18next'
import { Trans } from 'react-i18next'

import { type ColumnDef, FooterCell, FooterRow, GenericTable } from '@/common/components'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { IDCell } from '@/common/components/table/renderers/id'
import { SummaCell } from '@/common/components/table/renderers/summa'
import { formatLocaleDate, formatNumber } from '@/common/lib/format'

export interface RealCostDocumentsTrackerProps extends Omit<DialogTriggerProps, 'children'> {
  docs: RealCostDocument[]
  onClose: VoidFunction
}

export const RealCostDocumentsTracker = ({ docs, onClose }: RealCostDocumentsTrackerProps) => {
  return (
    <DialogTrigger
      isOpen={docs.length > 0}
      onOpenChange={onClose}
    >
      <DialogOverlay>
        <DialogContent className="w-full max-w-[1800px] h-full max-h-[900px] flex flex-col p-0 gap-0">
          <div>
            <DialogHeader className="p-5">
              <DialogTitle>
                <Trans>documents</Trans>
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1">
              <GenericTable
                data={docs ?? []}
                columnDefs={columns}
                footer={
                  <FooterRow>
                    <FooterCell
                      title={t('total')}
                      colSpan={5}
                    />
                    <FooterCell
                      content={formatNumber(100 ?? 0)}
                      colSpan={1}
                    />
                  </FooterRow>
                }
              />
            </div>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}

const columns: ColumnDef<RealCostDocument>[] = [
  {
    key: 'id',
    width: 160,
    minWidth: 160,
    renderCell: IDCell
  },
  {
    minWidth: 200,
    key: 'doc_num'
  },
  {
    minWidth: 200,
    key: 'doc_date',
    renderCell: (row) => formatLocaleDate(row.doc_date)
  },
  {
    minWidth: 100,
    key: 'year'
  },
  {
    minWidth: 100,
    key: 'name'
  },
  {
    minWidth: 100,
    key: 'inn'
  },
  {
    minWidth: 200,
    numeric: true,
    key: 'summa',
    renderCell: SummaCell
  }
]
