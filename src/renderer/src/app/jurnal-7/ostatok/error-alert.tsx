import type { ExistingDocument } from './utils'
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
import { formatLocaleDate, formatNumber } from '@renderer/common/lib/format'
import { Eye } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export interface ExistingDocsAlertProps extends DialogProps {
  message: string
  docs: ExistingDocument[]
  product?: OstatokProduct
}
export const ExistingDocsAlert = ({ docs, message, product, ...props }: ExistingDocsAlertProps) => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <AlertDialog {...props}>
      <AlertDialogContent className="max-w-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-bold text-2xl">{message}</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="flex flex-col gap-10">
          {product ? (
            <div>
              <DataList items={getProductFields(t, product)} />
            </div>
          ) : null}
          <ul className="divide-y">
            {docs.map((doc) => {
              const documentUrl = getDocumentUrl(doc.type, doc.id)
              return (
                <li
                  key={doc.id}
                  className="grid grid-cols-5 items-center gap-2 py-2"
                >
                  <Copyable value={doc.id}>
                    <b>#{doc.id}</b>
                  </Copyable>
                  <Copyable value={doc.doc_num}>
                    <b>{doc.doc_num}</b>
                  </Copyable>
                  <span className="text-sm">{formatLocaleDate(doc.doc_date)}</span>
                  <span>
                    <Badge variant="secondary">{t(doc.type)}</Badge>
                  </span>
                  <Button
                    size="icon"
                    variant="outline"
                    className="justify-self-end"
                    disabled={!documentUrl}
                    onClick={() => navigate(documentUrl!)}
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

const getProductFields = (t: TFunction, product: OstatokProduct) => {
  return [
    {
      name: t('code'),
      value: (
        <Copyable
          side="start"
          value={product.naimenovanie_tovarov_jur7_id}
        >
          #{product.naimenovanie_tovarov_jur7_id}
        </Copyable>
      )
    },
    {
      name: t('name'),
      value: <p className="font-medium">{product.name}</p>
    },
    {
      name: t('group'),
      value: <p className="font-medium">{product.group.name}</p>
    },
    {
      name: t('doc_date'),
      value: formatLocaleDate(product.doc_date)
    },
    {
      name: t('doc_num'),
      value: (
        <Copyable
          side="start"
          value={product.doc_num}
        >
          {product.doc_num}
        </Copyable>
      )
    },
    {
      name: t('responsible_short'),
      value: product.responsible.fio
    },
    {
      name: t('sena'),
      value: (
        <span className="text-xl">{formatNumber(product.sena ? Number(product.sena) : 0)}</span>
      )
    },
    {
      name: t('kol'),
      value: (
        <span className="text-xl">
          x{formatNumber(product.kol ? Number(product.kol) : 0, 0, 0)}
        </span>
      )
    },
    {
      name: t('summa'),
      value: (
        <span className="text-xl">{formatNumber(product.summa ? Number(product.summa) : 0)}</span>
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
