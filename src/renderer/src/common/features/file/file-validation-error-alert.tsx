import type { ImportValidationErrorRow } from './utils'
import type { DialogProps } from '@radix-ui/react-dialog'

import { useTranslation } from 'react-i18next'

import { GenericTableCell, GenericTableHead } from '@/common/components'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/common/components/ui/alert-dialog'
import { Table, TableBody, TableHeader, TableRow } from '@/common/components/ui/table'

export interface FileValidationErrorAlertProps extends DialogProps {
  message: string
  doc: ImportValidationErrorRow
}
export const FileValidationErrorAlert = ({
  message,
  doc,
  ...props
}: FileValidationErrorAlertProps) => {
  const { t } = useTranslation()
  return (
    <AlertDialog {...props}>
      <AlertDialogContent className="max-w-full">
        <AlertDialogHeader>
          <AlertDialogTitle>{message}</AlertDialogTitle>
        </AlertDialogHeader>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <GenericTableHead>{t('row')}</GenericTableHead>
                <GenericTableHead>{t('responsible')}</GenericTableHead>
                <GenericTableHead>{t('name')}</GenericTableHead>
                <GenericTableHead>{t('group')}</GenericTableHead>
                <GenericTableHead>{t('ei')}</GenericTableHead>
                <GenericTableHead>{t('month')}</GenericTableHead>
                <GenericTableHead>{t('year')}</GenericTableHead>
                <GenericTableHead>{t('kol')}</GenericTableHead>
                <GenericTableHead>{t('summa')}</GenericTableHead>
                <GenericTableHead>{t('iznos_summa_old')}</GenericTableHead>
                <GenericTableHead>{t('doc_num')}</GenericTableHead>
                <GenericTableHead>{t('doc_date')}</GenericTableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doc.index > 1 ? (
                <TableRow className="pointer-events-none select-none">
                  <GenericTableCell className="font-bold">{doc.index - 1}</GenericTableCell>
                  <GenericTableCell className="blur-sm">{doc.responsible_id}</GenericTableCell>
                  <GenericTableCell className="blur-sm">{doc.name}</GenericTableCell>
                  <GenericTableCell className="blur-sm">{doc.group_jur7_id}</GenericTableCell>
                  <GenericTableCell className="blur-sm">{doc.edin}</GenericTableCell>
                  <GenericTableCell className="blur-sm">{doc.month}</GenericTableCell>
                  <GenericTableCell className="blur-sm">{doc.year}</GenericTableCell>
                  <GenericTableCell className="blur-sm">{doc.kol}</GenericTableCell>
                  <GenericTableCell className="blur-sm">{doc.summa}</GenericTableCell>
                  <GenericTableCell className="blur-sm">{doc.eski_iznos_summa}</GenericTableCell>
                  <GenericTableCell className="blur-sm">{doc.doc_num}</GenericTableCell>
                  <GenericTableCell className="blur-sm">{doc.doc_date}</GenericTableCell>
                </TableRow>
              ) : null}
              <TableRow className="font-bold bg-red-50 hover:bg-red-50 even:bg-red-50 hover:even:bg-red-50">
                <GenericTableCell className="font-bold text-red-400">{doc.index}</GenericTableCell>
                <GenericTableCell className="font-bold text-red-400">
                  {doc.responsible_id}
                </GenericTableCell>
                <GenericTableCell className="font-bold text-red-400">{doc.name}</GenericTableCell>
                <GenericTableCell className="font-bold text-red-400">
                  {doc.group_jur7_id}
                </GenericTableCell>
                <GenericTableCell className="font-bold text-red-400">{doc.edin}</GenericTableCell>
                <GenericTableCell className="font-bold text-red-400">{doc.month}</GenericTableCell>
                <GenericTableCell className="font-bold text-red-400">{doc.year}</GenericTableCell>
                <GenericTableCell className="font-bold text-red-400">{doc.kol}</GenericTableCell>
                <GenericTableCell className="font-bold text-red-400">{doc.summa}</GenericTableCell>
                <GenericTableCell className="font-bold text-red-400">
                  {doc.eski_iznos_summa}
                </GenericTableCell>
                <GenericTableCell className="font-bold text-red-400">
                  {doc.doc_num}
                </GenericTableCell>
                <GenericTableCell className="font-bold text-red-400">
                  {doc.doc_date}
                </GenericTableCell>
              </TableRow>
              <TableRow className="pointer-events-none select-none">
                <GenericTableCell className="font-bold">{doc.index + 1}</GenericTableCell>
                <GenericTableCell className="blur-sm">{doc.responsible_id}</GenericTableCell>
                <GenericTableCell className="blur-sm">{doc.name}</GenericTableCell>
                <GenericTableCell className="blur-sm">{doc.group_jur7_id}</GenericTableCell>
                <GenericTableCell className="blur-sm">{doc.edin}</GenericTableCell>
                <GenericTableCell className="blur-sm">{doc.month}</GenericTableCell>
                <GenericTableCell className="blur-sm">{doc.year}</GenericTableCell>
                <GenericTableCell className="blur-sm">{doc.kol}</GenericTableCell>
                <GenericTableCell className="blur-sm">{doc.summa}</GenericTableCell>
                <GenericTableCell className="blur-sm">{doc.eski_iznos_summa}</GenericTableCell>
                <GenericTableCell className="blur-sm">{doc.doc_num}</GenericTableCell>
                <GenericTableCell className="blur-sm">{doc.doc_date}</GenericTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('close')}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
