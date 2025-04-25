import type { BankRasxodProvodka } from '@/common/models'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { MainSchetQueryKeys, MainSchetService } from '@/app/region-spravochnik/main-schet'
import { type ColumnDef, Fieldset, GenericTable, LoadingOverlay } from '@/common/components'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { LabeledValue } from '@/common/components/labeled-value'
import { Textarea } from '@/common/components/ui/textarea'
import { useRequisitesStore } from '@/common/features/requisites'
import { formatNumber } from '@/common/lib/format'
import { numberToWords } from '@/common/lib/utils'

import { BankRasxodQueryKeys } from './config'
import { PorucheniyaDialog } from './porucheniya-dialog'
import { BankRasxodService } from './service'

const provodkaColumns: ColumnDef<BankRasxodProvodka>[] = [
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
  },
  {
    key: 'podotchet',
    header: 'podotchet-litso',
    renderCell: (row) => row.podotchet?.name
  }
]

export interface BankRasxodViewDialogProps {
  selectedId: number | null
  onClose: VoidFunction
}
export const BankRasxodViewDialog = ({ selectedId, onClose }: BankRasxodViewDialogProps) => {
  const { t, i18n } = useTranslation(['app', 'report'])
  const { main_schet_id } = useRequisitesStore()

  const { data: main_schet, isFetching: isFetchingMainSchet } = useQuery({
    queryKey: [MainSchetQueryKeys.getById, main_schet_id],
    queryFn: MainSchetService.getById
  })
  const { data: rasxod, isFetching } = useQuery({
    queryKey: [BankRasxodQueryKeys.getById, selectedId!],
    queryFn: BankRasxodService.getById,
    enabled: !!selectedId
  })

  const data = rasxod?.data

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
          <div className="h-full flex flex-col overflow-hidden">
            <DialogHeader className="pb-5">
              <DialogTitle>{t('pages.bank_rasxod')}</DialogTitle>
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
                <div className="grid grid-cols-2 divide-x">
                  <Fieldset name={t('payer-info')}>
                    {main_schet?.data ? (
                      <>
                        <LabeledValue
                          label={t('payer')}
                          value={main_schet.data.tashkilot_nomi}
                        />
                        <LabeledValue
                          label={t('bank')}
                          value={main_schet.data.tashkilot_bank}
                        />
                        <LabeledValue
                          label={t('mfo')}
                          value={main_schet.data.tashkilot_mfo}
                        />
                        <LabeledValue
                          label={t('inn')}
                          value={main_schet.data.tashkilot_inn}
                        />
                        <LabeledValue
                          label={t('raschet-schet')}
                          value={main_schet.data.account_number ?? '-'}
                        />
                        <LabeledValue
                          label={t('raschet-schet-gazna')}
                          value={main_schet.data.gazna_number ?? '-'}
                        />
                      </>
                    ) : null}
                  </Fieldset>

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
                </div>
                <div className="grid grid-cols-2 divide-x">
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
                  <Fieldset name={t('shartnoma')}>
                    <div className="grid grid-cols-3 gap-5">
                      <LabeledValue
                        label={t('shartnoma-number')}
                        value={data.contract?.doc_num ?? '-'}
                      />
                      <LabeledValue
                        label={t('shartnoma-date')}
                        value={data.contract?.doc_date ?? '-'}
                      />
                      <LabeledValue
                        label={t('shartnoma-date')}
                        value={data.contract_grafik?.smeta_number ?? '-'}
                        className="col-span-2"
                      />
                    </div>
                  </Fieldset>
                </div>
                <div className="p-5">
                  <LabeledValue
                    label={t('opisanie')}
                    value={
                      <Textarea
                        readOnly
                        value={data.opisanie ?? '-'}
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
              {main_schet?.data && data ? (
                <PorucheniyaDialog
                  rasxod={data}
                  main_schet={main_schet.data}
                  organization={data.organ}
                  account_number={data.account_number?.raschet_schet}
                  account_number_gazna={data.gazna_number?.raschet_schet_gazna}
                />
              ) : null}
            </DialogFooter>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}

// name:
// form.watch('organization_porucheniya_name') ?? organSpravochnik.selected.name
