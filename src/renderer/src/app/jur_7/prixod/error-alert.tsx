import type { DialogProps } from '@radix-ui/react-dialog'
import type { TFunction } from 'i18next'

import { Eye, TriangleAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Copyable } from '@/common/components'
import { DataList } from '@/common/components/data-list'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/common/components/ui/alert-dialog'
import { Badge } from '@/common/components/ui/badge'
import { formatLocaleDate, formatNumber } from '@/common/lib/format'

export interface ErrorDataDocument {
  id: number
  doc_num: string
  doc_date: string
  opisanie: any
  summa: string
  kimga_name: any
  spravochnik_organization_okonx: any
  spravochnik_organization_bank_klient: any
  spravochnik_organization_raschet_schet: any
  spravochnik_organization_raschet_schet_gazna: any
  spravochnik_organization_mfo: any
  spravochnik_organization_inn: any
  kimdan_name: string
  type: string
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
              if (!error.document) {
                return
              }
              if (error.document?.type === 'rasxod') {
                navigate(`/journal-7/rasxod/${error.document.id}`)
              } else {
                navigate(`/journal-7/internal/${error.document.id}`)
              }
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
      value:
        document.type === 'rasxod' ? <Badge>{t('rasxod')}</Badge> : <Badge>{t('prixod')}</Badge>
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
    ...(document.type === 'rasxod'
      ? []
      : [
          {
            name: t('to-whom'),
            value: document.kimga_name
          }
        ]),
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
