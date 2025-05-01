import type { GetDocsArgs } from '../service'
import type { ColumnDef } from '@/common/components'
import type { OdinoxDocument, OdinoxRasxod } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { Trans } from 'react-i18next'

import { GenericTable } from '@/common/components'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { ProvodkaBadge } from '@/common/components/provodka-badge'
import { IDCell } from '@/common/components/table/renderers/id'
import { SummaCell } from '@/common/components/table/renderers/summa'
import { formatLocaleDate } from '@/common/lib/format'

export interface OdinoxDocumentsTrackerProps extends Omit<DialogTriggerProps, 'children'> {
  args?: GetDocsArgs
  docs: OdinoxDocument[]
  onClose: VoidFunction
}

export const OdinoxDocumentsTracker = ({ args, docs, onClose }: OdinoxDocumentsTrackerProps) => {
  return (
    <DialogTrigger
      isOpen={!!args}
      onOpenChange={onClose}
    >
      <DialogOverlay>
        <DialogContent className="w-full max-w-[1800px] h-full max-h-[900px] flex flex-col p-0 gap-0 overflow-hidden">
          <div className="w-full flex flex-col">
            <DialogHeader className="p-5">
              <DialogTitle>
                <Trans ns="app">documents</Trans>
              </DialogTitle>
            </DialogHeader>
            <div className="w-full max-w-[1800px] flex-1 overflow-x-auto scrollbar">
              <GenericTable
                data={docs ?? []}
                columnDefs={RasxodDocumentColumns}
                style={{ width: 2000 }}
              />
            </div>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}

export const RasxodDocumentColumns: ColumnDef<OdinoxRasxod>[] = [
  {
    key: 'id',
    renderCell: IDCell,
    width: 160,
    minWidth: 160
  },
  {
    fit: true,
    minWidth: 200,
    key: 'doc_num'
  },
  {
    fit: true,
    minWidth: 200,
    key: 'doc_date',
    renderCell: (row) => formatLocaleDate(row.doc_date)
  },
  {
    minWidth: 400,
    numeric: true,
    key: 'summa',
    renderCell: (row) => (
      <div className="font-bold">
        <SummaCell summa={row.summa} />
      </div>
    )
  },
  {
    width: 200,
    key: 'schet'
  },
  {
    width: 300,
    key: 'sub_schet',
    header: 'subschet'
  },
  {
    key: 'type',
    renderCell: (row) => <ProvodkaBadge type={row.type} />
  }
]
