import type { DialogProps } from '@radix-ui/react-dialog'
import type { TFunction } from 'i18next'

import { Copyable } from '@renderer/common/components'
import { DataList } from '@renderer/common/components/data-list'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@renderer/common/components/ui/alert-dialog'
import { Badge } from '@renderer/common/components/ui/badge'
import { formatLocaleDate, formatNumber } from '@renderer/common/lib/format'
import { Eye, TriangleAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export interface ErrorDataDocument {
  id: number
  doc_num: string
  doc_date: string
  opisanie: any
  summa: number
  kimdan_id: number
  kimdan_name: any
  kimga_id: number
  kimga_name: any
  doverennost: string
  j_o_num: string
  id_shartnomalar_organization: number
  organization_by_raschet_schet_id: number
  organization_by_raschet_schet_gazna_id: any
  shartnoma_grafik_id: number
}

export interface ErrorData {
  document: ErrorDataDocument
  message: string
}

export interface ErrorAlertProps extends DialogProps {
  error: ErrorData
}
export const ErrorAlert = ({ error, ...props }: ErrorAlertProps) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <AlertDialog {...props}>
      <AlertDialogContent className="max-w-xl">
        <AlertDialogHeader>
          <div className="size-16 bg-red-500 rounded-full grid place-items-center border-2 border-red-500">
            <TriangleAlert className="size-10 text-white" />
          </div>
          <AlertDialogTitle className="font-bold text-2xl">{error.message}</AlertDialogTitle>
        </AlertDialogHeader>
        <div>
          <DataList items={getErrorDocumentItems(t, error.document)} />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              navigate(`/journal-7/prixod/${error.document.id}`)
            }}
          >
            <Eye className="mr-2 btn-icon icon-start" /> {t('show_document')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const getErrorDocumentItems = (t: TFunction, document: ErrorDataDocument) => {
  return [
    {
      name: t('type-document'),
      value: <Badge>{t('prixod')}</Badge>
    },
    {
      name: t('doc_date'),
      value: formatLocaleDate(document.doc_date)
    },
    {
      name: t('doc_num'),
      value: (
        <Copyable
          side="start"
          value={document.doc_num}
        >
          {document.doc_num}
        </Copyable>
      )
    },
    {
      name: t('from-who'),
      value: document.kimdan_name
    },
    {
      name: t('to-whom'),
      value: document.kimga_name
    },
    {
      name: t('opisanie'),
      value: document.opisanie
    },
    {
      name: t('summa'),
      value: (
        <span className="text-xl">{formatNumber(document.summa ? Number(document.summa) : 0)}</span>
      )
    }
  ]
}
