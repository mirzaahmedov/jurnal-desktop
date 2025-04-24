import type { KassaPrixodProvodka } from '@/common/models'
import type { HTMLAttributes, ReactNode } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { type ColumnDef, Fieldset, GenericTable, LoadingOverlay } from '@/common/components'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Textarea } from '@/common/components/ui/textarea'
import { formatNumber } from '@/common/lib/format'
import { cn, numberToWords } from '@/common/lib/utils'

import { PrixodQueryKeys } from './config'
import { KassaPrixodService } from './service'

const provodkaColumns: ColumnDef<KassaPrixodProvodka>[] = [
  {
    key: 'schet',
    renderCell: (row) => row.operatsii?.schet
  },
  {
    key: 'subschet',
    renderCell: (row) => row.operatsii?.sub_schet
  },
  {
    numeric: true,
    key: 'summa'
  },
  {
    key: 'type_operatsii',
    header: 'type-operatsii',
    renderCell: (row) => row.type_operatsii?.name
  },
  {
    key: 'sostav',
    renderCell: (row) => row.sostav?.name
  },
  {
    key: 'podrazdelenie',
    renderCell: (row) => row.podrazdelenie?.name
  }
]

export interface KassaPrixodViewDialogProps {
  selectedId: number | null
  onClose: VoidFunction
}
export const KassaPrixodViewDialog = ({ selectedId, onClose }: KassaPrixodViewDialogProps) => {
  const { t, i18n } = useTranslation(['app'])

  const { data: prixod, isFetching } = useQuery({
    queryKey: [PrixodQueryKeys.getById, selectedId!],
    queryFn: KassaPrixodService.getById,
    enabled: !!selectedId
  })

  const data = prixod?.data

  return (
    <DialogTrigger
      isOpen={!!selectedId}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
    >
      <DialogOverlay>
        <DialogContent className="relative w-full max-w-7xl h-full max-h-[800px] overflow-hidden">
          {isFetching ? <LoadingOverlay /> : null}
          <div className="space-y-10 h-full flex flex-col overflow-hidden">
            <DialogHeader>
              <DialogTitle>{t('pages.kassa_prixod')}</DialogTitle>
            </DialogHeader>
            {data ? (
              <div className="flex-1 divide-y overflow-y-auto scrollbar">
                <Fieldset name={t('document')}>
                  <div className="grid grid-cols-4 gap-5">
                    <LabeledValue
                      label={t('doc_num')}
                      value={data.doc_num}
                    />
                    <LabeledValue
                      label={t('doc_date')}
                      value={data.doc_date}
                    />
                  </div>
                </Fieldset>
                <div className="grid grid-cols-2">
                  <Fieldset name={t('podotchet-litso')}>
                    <div className="grid grid-cols-2 gap-5">
                      <LabeledValue
                        label={t('fio')}
                        value={data.spravochnik_podotchet_litso_name}
                      />
                      <LabeledValue
                        label={t('rayon')}
                        value={data.spravochnik_podotchet_litso_rayon}
                      />
                    </div>
                  </Fieldset>

                  <Fieldset name={t('summa')}>
                    <div className="grid grid-cols-3 gap-5">
                      <LabeledValue
                        label={t('summa')}
                        value={formatNumber(Number(data.summa))}
                      />
                      <LabeledValue
                        className="col-span-2"
                        label={null}
                        value={
                          <Textarea
                            value={numberToWords(Number(data.summa), i18n.language)}
                            className="font-normal"
                          />
                        }
                      />
                    </div>
                  </Fieldset>
                </div>
                <div className="p-5">
                  <LabeledValue
                    label={t('opisanie')}
                    value={
                      <Textarea
                        value={data.opisanie}
                        className="font-normal"
                      />
                    }
                  />
                </div>
                <GenericTable
                  columnDefs={provodkaColumns}
                  data={data.childs}
                />
              </div>
            ) : null}
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}

export interface LabeledValueProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode
  value: ReactNode
}
const LabeledValue = ({ label, value, ...props }: LabeledValueProps) => {
  return (
    <div
      {...props}
      className={cn('flex flex-col space-y-1', props?.className)}
    >
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  )
}
