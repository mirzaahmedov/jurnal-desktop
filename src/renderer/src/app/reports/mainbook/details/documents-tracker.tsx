import type { MainbookDocumentInfo, ProvodkaType } from '@/common/models'
import type { DialogProps } from '@radix-ui/react-dialog'

import { useQuery } from '@tanstack/react-query'
import { Trans } from 'react-i18next'

import { type ColumnDef, GenericTable } from '@/common/components'
import { ProvodkaBadge } from '@/common/components/provodka-badge'
import { IDCell } from '@/common/components/table/renderers/id'
import { SummaCell } from '@/common/components/table/renderers/summa'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog'
import { formatLocaleDate } from '@/common/lib/format'

import { MainbookQueryKeys } from '../config'
import { MainbookService } from '../service'

export interface MainbookDocumentsTrackerProps extends DialogProps {
  budjet_id?: number
  year?: number
  month?: number
  schet?: string
  type_id?: number
  prixod?: boolean
}

export const MainbookDocumentsTracker = ({
  budjet_id,
  year,
  month,
  schet,
  type_id,
  prixod,
  ...props
}: MainbookDocumentsTrackerProps) => {
  const { data: documents } = useQuery({
    queryKey: [
      MainbookQueryKeys.getMainbookDocuments,
      {
        budjet_id: budjet_id!,
        year: year!,
        month: month!,
        schet: schet!,
        type_id: type_id!,
        prixod: !!prixod,
        rasxod: !prixod
      }
    ],
    queryFn: MainbookService.getMainbookDocuments,
    enabled: props.open && !!budjet_id && !!year && !!month && !!schet
  })
  return (
    <Dialog {...props}>
      <DialogContent className="w-full max-w-[1800px] h-full max-h-[900px] flex flex-col p-0 gap-0">
        <DialogHeader className="p-5">
          <DialogTitle>
            <Trans>documents</Trans>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1">
          <GenericTable
            data={documents?.data ?? []}
            columnDefs={columns}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

const columns: ColumnDef<MainbookDocumentInfo>[] = [
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
    key: 'debet_schet',
    header: 'debet'
  },
  {
    minWidth: 100,
    key: 'kredit_schet',
    header: 'kredit'
  },
  {
    minWidth: 200,
    numeric: true,
    key: 'summa',
    renderCell: SummaCell
  },
  {
    fill: true,
    minWidth: 350,
    key: 'opisanie'
  },
  {
    minWidth: 300,
    key: 'type',
    renderCell: (row) => <ProvodkaBadge type={row.type as ProvodkaType} />
  }
]
