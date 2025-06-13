import type { BankPrixodPodvodka } from '@/common/models'

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
import { PDFSaver } from '@/common/components/pdf-saver'
import { Textarea } from '@/common/components/ui/textarea'
import { useRequisitesStore } from '@/common/features/requisites'
import { formatLocaleDate, formatNumber } from '@/common/lib/format'
import { numberToWords } from '@/common/lib/utils'

import { BankPrixodQueryKeys } from './config'
import { BankPrixodService } from './service'

const provodkaColumns: ColumnDef<BankPrixodPodvodka>[] = [
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
    key: 'podotchet-litso',
    renderCell: (row) => row.podotchet?.name
  }
]

export interface BankPrixodViewDialogProps {
  selectedId: number | null
  onClose: VoidFunction
}
export const BankPrixodViewDialog = ({ selectedId, onClose }: BankPrixodViewDialogProps) => {
  const { t, i18n } = useTranslation(['app', 'report'])
  const { main_schet_id } = useRequisitesStore()

  const { data: main_schet, isFetching: isFetchingMainSchet } = useQuery({
    queryKey: [MainSchetQueryKeys.getById, main_schet_id],
    queryFn: MainSchetService.getById
  })
  const { data: prixod, isFetching } = useQuery({
    queryKey: [BankPrixodQueryKeys.getById, selectedId!],
    queryFn: BankPrixodService.getById,
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
        <DialogContent className="relative w-full max-w-8xl h-full max-h-[900px] overflow-hidden">
          {isFetching || isFetchingMainSchet ? <LoadingOverlay /> : null}
          <PDFSaver filename={`${t('pages.bank_prixod')}_№${data?.doc_num}.pdf`}>
            {({ ref, savePDF, isPending }) => (
              <div
                ref={ref}
                className="h-full flex flex-col overflow-hidden"
              >
                <DialogHeader className="p-5">
                  <DialogTitle>{t('pages.bank_prixod')}</DialogTitle>
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

                      <Fieldset name={t('payer-info')}>
                        {main_schet?.data ? (
                          <>
                            <LabeledValue
                              label={t('payer')}
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
                                readOnly
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
                            value={data.contract?.doc_num}
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
                              data.smeta_number ? `${data.smeta_number} (${data.smeta_name})` : '-'
                            }
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
                <DialogFooter className="pdf-hidden">
                  <Button
                    variant="ghost"
                    IconStart={Download}
                    isPending={isPending}
                    onPress={savePDF}
                  >
                    {t('download_as_pdf')}
                  </Button>
                </DialogFooter>
              </div>
            )}
          </PDFSaver>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
