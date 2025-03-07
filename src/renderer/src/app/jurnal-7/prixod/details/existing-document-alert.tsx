import type { ExistingDocument } from './interfaces'
import type { DialogProps } from '@radix-ui/react-dialog'

import { Copyable } from '@renderer/common/components'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@renderer/common/components/ui/alert-dialog'
import { Badge } from '@renderer/common/components/ui/badge'
import { Button } from '@renderer/common/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@renderer/common/components/ui/table'
import { formatLocaleDate } from '@renderer/common/lib/format'
import { Eye } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

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
      <AlertDialogContent className="max-w-7xl h-full max-h-[500px] flex flex-col">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-bold text-2xl">{message}</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="flex-1 flex flex-col gap-10">
          <Table className="border-t">
            <TableHeader>
              <TableRow>
                <TableHead>{t('id')}</TableHead>
                <TableHead>{t('doc_num')}</TableHead>
                <TableHead>{t('doc_date')}</TableHead>
                <TableHead>{t('from-who')}</TableHead>
                <TableHead>{t('to-whom')}</TableHead>
                <TableHead>{t('summa')}</TableHead>
                <TableHead>{t('type')}</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {docs.map((doc) => {
                const documentUrl = getDocumentUrl(doc.type, doc.id)
                return (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <Copyable value={doc.id}>
                        <b>#{doc.id}</b>
                      </Copyable>
                    </TableCell>
                    <TableCell>
                      <Copyable value={doc.doc_num}>
                        <b>{doc.doc_num}</b>
                      </Copyable>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{formatLocaleDate(doc.doc_date)}</span>
                    </TableCell>
                    <TableCell>
                      <span>{doc.kimdan_name}</span>
                    </TableCell>
                    <TableCell>
                      <span>{doc.kimga_name}</span>
                    </TableCell>
                    <TableCell>
                      <b>{doc.summa}</b>
                    </TableCell>
                    <TableCell>
                      <span>
                        <Badge variant="secondary">{t(doc.type)}</Badge>
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="icon"
                        variant="outline"
                        className="justify-self-end"
                        disabled={!documentUrl}
                        onClick={() => navigate(documentUrl!)}
                      >
                        <Eye className="btn-icon" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
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
      return `/journal-7/internal-transfer/${id}`
    default:
      return undefined
  }
}
