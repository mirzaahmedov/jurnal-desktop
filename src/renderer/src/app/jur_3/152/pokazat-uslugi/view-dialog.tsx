import type { PokazatUslugiProvodka } from '@/common/models'

import { useQuery } from '@tanstack/react-query'
import { Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { MainSchetQueryKeys, MainSchetService } from '@/app/region-spravochnik/main-schet'
import { type ColumnDef, Fieldset, GenericTable, LoadingOverlay } from '@/common/components'
import { Button } from '@/common/components/jolly/button'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { LabeledValue } from '@/common/components/labeled-value'
import { Printer } from '@/common/components/printer'
import { Textarea } from '@/common/components/ui/textarea'
import { useRequisitesStore } from '@/common/features/requisites'
import { formatLocaleDate, formatNumber } from '@/common/lib/format'
import { numberToWords } from '@/common/lib/utils'

import { PokazatUslugiQueryKeys } from './config'
import { PokazatUslugiService } from './service'

const provodkaColumns: ColumnDef<PokazatUslugiProvodka>[] = [
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
    key: 'kol'
  },
  {
    numeric: true,
    key: 'sena'
  },
  {
    numeric: true,
    key: 'summa'
  },
  {
    numeric: true,
    key: 'nds_foiz'
  },
  {
    numeric: true,
    key: 'nds_summa'
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

export interface PokazatUslugiViewDialogProps {
  selectedId: number | null
  onClose: VoidFunction
}
export const PokazatUslugiViewDialog = ({ selectedId, onClose }: PokazatUslugiViewDialogProps) => {
  const { t, i18n } = useTranslation(['app', 'report'])
  const { main_schet_id } = useRequisitesStore()

  const { data: main_schet, isFetching: isFetchingMainSchet } = useQuery({
    queryKey: [MainSchetQueryKeys.getById, main_schet_id],
    queryFn: MainSchetService.getById
  })
  const { data: usluga, isFetching } = useQuery({
    queryKey: [PokazatUslugiQueryKeys.getById, selectedId!],
    queryFn: PokazatUslugiService.getById,
    enabled: !!selectedId
  })

  const data = usluga?.data

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
        <DialogContent className="relative w-full max-w-8xl h-full max-h-[900px] overflow-hidden">
          {isFetching || isFetchingMainSchet ? <LoadingOverlay /> : null}
          <Printer filename={`${t('pages.service')}.pdf`}>
            {({ ref, print }) => (
              <div className="h-full flex flex-col overflow-hidden">
                <DialogHeader className="pb-5">
                  <DialogTitle>{t('pages.service')}</DialogTitle>
                </DialogHeader>
                {data ? (
                  <div
                    ref={ref}
                    className="flex-1 divide-y overflow-y-auto scrollbar"
                  >
                    <Fieldset name={t('document')}>
                      <div className="grid grid-cols-4 gap-5">
                        <LabeledValue
                          label={t('doc_num')}
                          value={data.doc_num}
                        />
                        <LabeledValue
                          label={t('doc_date')}
                          value={data.doc_date ? formatLocaleDate(data.doc_date) : ''}
                        />
                      </div>
                    </Fieldset>
                    <div className="grid grid-cols-2 divide-x">
                      <Fieldset name={t('receiver-info')}>
                        {main_schet?.data ? (
                          <>
                            <LabeledValue
                              label={t('receiver')}
                              value={data.organ.name}
                            />
                            <LabeledValue
                              label={t('bank')}
                              value={data.organ.bank_klient}
                            />
                            <LabeledValue
                              label={t('mfo')}
                              value={data.organ.mfo}
                            />
                            <LabeledValue
                              label={t('inn')}
                              value={data.organ.inn}
                            />
                            <LabeledValue
                              label={t('raschet-schet')}
                              value={data.account_number?.raschet_schet ?? '-'}
                            />
                            <LabeledValue
                              label={t('raschet-schet-gazna')}
                              value={data.gazna_number?.raschet_schet_gazna ?? '-'}
                            />
                          </>
                        ) : null}
                      </Fieldset>
                      <div className="grid grid-cols-1 divide-y">
                        <Fieldset name={t('shartnoma')}>
                          <div className="grid grid-cols-3 gap-5">
                            <LabeledValue
                              label={t('shartnoma-number')}
                              value={data.contract?.doc_num ?? '-'}
                            />
                            <LabeledValue
                              label={t('shartnoma-date')}
                              value={
                                data.contract?.doc_date
                                  ? formatLocaleDate(data.contract?.doc_date)
                                  : '-'
                              }
                            />
                            <LabeledValue
                              label={t('shartnoma-grafik')}
                              value={
                                data.smeta_number
                                  ? `${data.smeta_number} (${data.smeta_name})`
                                  : '-'
                              }
                              className="col-span-2"
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
                                  readOnly
                                  value={numberToWords(Number(data.summa), i18n.language)}
                                  className="font-normal"
                                />
                              }
                            />
                          </div>
                        </Fieldset>
                      </div>
                    </div>

                    <div className="p-5">
                      <LabeledValue
                        label={t('opisanie')}
                        value={
                          <Textarea
                            readOnly
                            value={data.opisanie ?? ''}
                            className="font-normal"
                          />
                        }
                      />
                    </div>
                    <div className="p-5">
                      <GenericTable
                        columnDefs={provodkaColumns}
                        data={data.childs}
                        className="table-generic-xs"
                      />
                    </div>
                  </div>
                ) : null}
                <DialogFooter>
                  <Button
                    variant="ghost"
                    IconStart={Download}
                    onPress={print}
                  >
                    {t('download')}
                  </Button>
                </DialogFooter>
              </div>
            )}
          </Printer>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
