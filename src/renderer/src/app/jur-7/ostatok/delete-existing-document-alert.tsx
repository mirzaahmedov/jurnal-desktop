import type { OstatokDeleteExistingDocument } from './utils'
import type { OstatokProduct } from '@/common/models'
import type { DialogProps } from '@radix-ui/react-dialog'
import type { TFunction } from 'i18next'

import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { Pencil, RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import InternalDetails from '@/app/jur-7/internal/details/details'
import PrixodDetails from '@/app/jur-7/prixod/details/details'
import RasxodDetails from '@/app/jur-7/rasxod/details/details'
import { mainSchetQueryKeys, mainSchetService } from '@/app/region-spravochnik/main-schet'
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
import { Button } from '@/common/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog'
import { RequisitesDialog, useRequisitesStore } from '@/common/features/requisites'
import { useToggle } from '@/common/hooks'
import { formatLocaleDate, formatNumber } from '@/common/lib/format'

export interface DeleteExistingDocumentsAlertProps extends DialogProps {
  message: string
  docs: OstatokDeleteExistingDocument[]
  product?: OstatokProduct
  onRemove?: (product?: OstatokProduct) => void
}
export const DeleteExistingDocumentsAlert = ({
  docs,
  message,
  product,
  onRemove,
  ...props
}: DeleteExistingDocumentsAlertProps) => {
  const requisitesDialogToggle = useToggle()
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)

  const [selected, setSelected] = useState<OstatokDeleteExistingDocument | undefined>()

  const { t } = useTranslation()

  const { data: main_schet } = useQuery({
    queryKey: [mainSchetQueryKeys.getById, main_schet_id],
    queryFn: mainSchetService.getById
  })

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
                    onClick={() => {
                      if (main_schet_id !== doc.main_schet_id) {
                        toast.error(t('main_schet_mismatch'))
                      } else {
                        setSelected(doc)
                      }
                    }}
                  >
                    <Pencil className="btn-icon" />
                  </Button>
                </li>
              )
            })}
          </ul>
        </div>

        <Dialog
          open={!!selected}
          onOpenChange={() => setSelected(undefined)}
        >
          <DialogContent className="p-0 w-full max-w-screen-2xl h-full max-h-[80%] gap-0">
            <DialogHeader className="p-5 border-b">
              <DialogTitle>
                {selected?.type === 'prixod'
                  ? t('prixod')
                  : selected?.type === 'rasxod'
                    ? t('rasxod')
                    : selected?.type === 'internal'
                      ? t('internal')
                      : null}
              </DialogTitle>
            </DialogHeader>
            <div className="overflow-auto scrollbar">
              {selected?.type === 'prixod' ? (
                <PrixodDetails
                  id={String(selected?.id)}
                  onSuccess={() => {
                    setSelected(undefined)
                  }}
                />
              ) : selected?.type === 'rasxod' ? (
                <RasxodDetails
                  id={String(selected?.id)}
                  onSuccess={() => {
                    setSelected(undefined)
                  }}
                />
              ) : selected?.type === 'internal' ? (
                <InternalDetails
                  id={String(selected?.id)}
                  onSuccess={() => {
                    setSelected(undefined)
                  }}
                />
              ) : null}
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialogFooter className="items-end">
          <div className="flex items-center flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={requisitesDialogToggle.open}
            >
              <RefreshCw />
            </Button>

            <div className="flex flex-col gap-0.5 cursor-pointer">
              <p className="text-xs font-medium text-slate-500">{t('main-schet')}</p>
              <p className="text-base font-semibold">
                {[main_schet?.data?.account_number].filter((value) => !!value).join(' - ')}
              </p>
            </div>

            <RequisitesDialog
              open={requisitesDialogToggle.isOpen}
              onOpenChange={requisitesDialogToggle.setOpen}
            />
          </div>

          <AlertDialogCancel>{t('close')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onRemove?.(product)
            }}
          >
            {t('removed')}
          </AlertDialogAction>
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
