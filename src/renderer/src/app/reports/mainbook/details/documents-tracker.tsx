import type { MainbookDocumentInfo } from '@/common/models'
import type { DialogProps } from '@radix-ui/react-dialog'

import { useQuery } from '@tanstack/react-query'

import { type ColumnDef, GenericTable } from '@/common/components'
import { IDCell } from '@/common/components/table/renderers/id'
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
    enabled: !!budjet_id && !!year && !!month && !!schet
  })
  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {prixod ? 'Приход' : 'Расход'} {year} {month} {schet}
          </DialogTitle>
        </DialogHeader>
        <div>
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
    key: 'doc_num'
  },
  {
    key: 'doc_date',
    renderCell: (row) => formatLocaleDate(row.doc_date)
  },
  {
    key: 'debet_schet'
  },
  {
    key: 'kredit_schet'
  },
  {
    key: 'summa'
  },
  {
    key: 'opisanie'
  },
  {
    key: 'type'
  }
]
