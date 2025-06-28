import type { ExistingDocument } from './interfaces'
import type { DialogProps } from '@radix-ui/react-dialog'

import { Eye } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { GenericTable } from '@/common/components/generic-table'
import { IDCell } from '@/common/components/table/renderers/id'
import { SummaCell } from '@/common/components/table/renderers/summa'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/common/components/ui/alert-dialog'
import { Badge } from '@/common/components/ui/badge'
import { Button } from '@/common/components/ui/button'
import { formatLocaleDate } from '@/common/lib/format'

export interface ExistingDocumentsAlertProps extends DialogProps {
  message: string
  docs: ExistingDocument[]
}
export const ExistingDocumentsAlert = ({
  docs,
  message,
  ...props
}: ExistingDocumentsAlertProps) => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <AlertDialog {...props}>
      <AlertDialogContent className="max-w-9xl h-full max-h-[600px] flex flex-col">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-bold text-2xl">{message}</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="flex-1 flex flex-col gap-10 overflow-y-auto scrollbar">
          <GenericTable
            data={Array.from({ length: 30 }, () => docs[0])}
            columnDefs={[
              {
                key: 'id',
                renderCell: IDCell,
                width: 160,
                minWidth: 160
              },
              {
                key: 'doc_num',
                width: 200
              },
              {
                key: 'doc_date',
                width: 150,
                renderCell: (row) => formatLocaleDate(row.doc_date)
              },
              {
                key: 'kimdan_name',
                width: 200,
                renderCell: (row) => <span>{row.kimdan_name}</span>
              },
              {
                key: 'kimga_name',
                width: 200,
                renderCell: (row) => <span>{row.kimga_name}</span>
              },
              {
                key: 'summa',
                width: 150,
                renderCell: (row) => <SummaCell summa={Number(row.summa)} />
              },
              {
                key: 'type',
                width: 150,
                renderCell: (row) => <Badge variant="secondary">{t(row.type)}</Badge>
              },
              {
                key: 'actions',
                width: 100,
                renderCell: (row) => {
                  const documentUrl = getDocumentUrl(row.type, row.id)
                  return (
                    <Button
                      size="icon"
                      variant="outline"
                      className="justify-self-end"
                      disabled={!documentUrl}
                      onClick={() => navigate(documentUrl!)}
                    >
                      <Eye className="btn-icon" />
                    </Button>
                  )
                }
              }
            ]}
            className="table-generic-xs"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export const getDocumentUrl = (type: 'prixod' | 'internal' | 'rasxod', id: number) => {
  switch (type) {
    case 'prixod':
      return `/journal-7/prixod/${id}`
    case 'rasxod':
      return `/journal-7/rasxod/${id}`
    case 'internal':
      return `/journal-7/internal/${id}`
    default:
      return undefined
  }
}
