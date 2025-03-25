import type { OstatokDeleteExistingDocument } from './utils'
import type { DialogProps } from '@radix-ui/react-dialog'
import type { OstatokProduct } from '@renderer/common/models'
import type { TFunction } from 'i18next'

import { Copyable } from '@renderer/common/components'
import { DataList } from '@renderer/common/components/data-list'
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
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { formatLocaleDate, formatNumber } from '@renderer/common/lib/format'
import { Eye } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export interface DeleteExistingDocumentsAlertProps extends DialogProps {
  message: string
  docs: OstatokDeleteExistingDocument[]
  product?: OstatokProduct
}
export const DeleteExistingDocumentsAlert = ({
  docs,
  message,
  product,
  ...props
}: DeleteExistingDocumentsAlertProps) => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)

  return (
    <AlertDialog {...props}>
      <AlertDialogContent className="max-w-4xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-bold text-2xl">{message}</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="flex flex-col gap-10">
          {product ? (
            <div>
              <DataList list={getProductFields(t, product)} />
            </div>
          ) : null}
          <ul className="divide-y">
            <li className="grid grid-cols-8 items-center gap-4 py-2 text-xs">
              <b>{t('id')}</b>
              <b>№</b>
              <b>{t('date')}</b>
              <b className="col-span-3 text-end">{t('main-schet')}</b>
              <b className="text-end">{t('type')}</b>
              <b className="text-end">{t('actions')}</b>
            </li>
            {docs.map((doc) => {
              const documentUrl = getDocumentUrl(doc.type, doc.id)
              return (
                <li
                  key={doc.id}
                  className="grid grid-cols-8 items-center gap-4 py-2"
                >
                  <Copyable value={doc.id}>
                    <b>#{doc.id}</b>
                  </Copyable>
                  <Copyable value={doc.doc_num}>
                    <b>{doc.doc_num}</b>
                  </Copyable>
                  <span className="text-sm">{formatLocaleDate(doc.doc_date)}</span>
                  <div className="col-span-3 flex flex-col items-end">
                    <Copyable
                      side="start"
                      value={doc.account_number}
                    >
                      {doc.account_number}
                    </Copyable>
                    <Copyable
                      side="start"
                      value={doc.main_schet_id}
                    >
                      <b>#{doc.main_schet_id}</b>
                    </Copyable>
                  </div>
                  <span className="text-end">
                    <Badge variant="secondary">{t(doc.type)}</Badge>
                  </span>
                  <Button
                    size="icon"
                    variant="outline"
                    className="justify-self-end"
                    disabled={!documentUrl}
                    onClick={() => {
                      if (main_schet_id !== doc.main_schet_id) {
                        toast.error(t('main_schet_mismatch'))
                      } else {
                        navigate(documentUrl!)
                      }
                    }}
                  >
                    <Eye className="btn-icon" />
                  </Button>
                </li>
              )
            })}
          </ul>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const getProductFields = (t: TFunction, product: OstatokProduct = {} as any) => {
  return [
    {
      name: t('code'),
      value: (
        <Copyable
          side="start"
          value={product.id}
        >
          #{product.id}
        </Copyable>
      )
    },
    {
      name: t('name'),
      value: <p className="font-medium">{product.name}</p>
    },
    {
      name: t('group'),
      value: <p className="font-medium">{product.group_name}</p>
    },
    {
      name: t('doc_date'),
      value: formatLocaleDate(product.prixodData.docDate)
    },
    {
      name: t('doc_num'),
      value: (
        <Copyable
          side="start"
          value={product.prixodData.docNum}
        >
          {product.prixodData.docNum}
        </Copyable>
      )
    },
    {
      name: t('responsible_short'),
      value: product.fio
    },
    {
      name: t('sena'),
      value: (
        <span className="text-xl">
          {formatNumber(product.to?.sena ? Number(product.to?.sena) : 0)}
        </span>
      )
    },
    {
      name: t('kol'),
      value: (
        <span className="text-xl">
          x{formatNumber(product.to?.kol ? Number(product.to?.kol) : 0, 0, 0)}
        </span>
      )
    },
    {
      name: t('summa'),
      value: (
        <span className="text-xl">
          {formatNumber(product.to?.summa ? Number(product.to?.summa) : 0)}
        </span>
      )
    }
  ]
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
