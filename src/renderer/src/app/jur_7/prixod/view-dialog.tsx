import type { WarehouseProvodka } from '@/common/models'

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
import { Checkbox } from '@/common/components/ui/checkbox'
import { Textarea } from '@/common/components/ui/textarea'
import { useRequisitesStore } from '@/common/features/requisites'
import { formatLocaleDate, formatNumber } from '@/common/lib/format'
import { numberToWords } from '@/common/lib/utils'

import { WarehousePrixodQueryKeys } from './config'
import { WarehousePrixodService } from './service'

const provodkaColumns: ColumnDef<WarehouseProvodka>[] = [
  {
    key: 'group',
    renderCell: (row) => row.group?.group_number ?? row.group?.name
  },
  {
    key: 'name'
  },
  {
    key: 'serial_num',
    header: 'serial-num'
  },
  {
    key: 'inventar_num',
    header: 'inventar-num'
  },
  {
    key: 'edin',
    header: 'ei'
  },
  {
    className: 'text-end',
    headerClassName: 'text-end',
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
    key: 'iznos',
    renderCell: (row) => <Checkbox checked={row.iznos} />
  },
  {
    key: 'iznos_start',
    header: 'iznos_start_date',
    renderCell: (row) => formatLocaleDate(row.iznos_start)
  },
  {
    numeric: true,
    key: 'eski_iznos_summa',
    header: 'iznos_summa_old'
  },
  {
    key: 'debet',
    headerClassName: 'text-center',
    columns: [
      {
        key: 'debet_schet',
        header: 'schet'
      },
      {
        key: 'debet_sub_schet',
        header: 'subschet'
      }
    ]
  },
  {
    key: 'kredit',
    headerClassName: 'text-center',
    columns: [
      {
        key: 'kredit_schet',
        header: 'schet'
      },
      {
        key: 'kredit_sub_schet',
        header: 'subschet'
      }
    ]
  },
  {
    key: 'data_pereotsenka',
    header: 'prixod_date',
    renderCell: (row) => formatLocaleDate(row.iznos_start)
  }
]

export interface WarehousePrixodViewDialogProps {
  selectedId: number | null
  onClose: VoidFunction
}
export const WarehousePrixodViewDialog = ({
  selectedId,
  onClose
}: WarehousePrixodViewDialogProps) => {
  const { t, i18n } = useTranslation(['app', 'report'])
  const { main_schet_id } = useRequisitesStore()

  const { data: main_schet, isFetching: isFetchingMainSchet } = useQuery({
    queryKey: [MainSchetQueryKeys.getById, main_schet_id],
    queryFn: MainSchetService.getById
  })
  const { data: prixod, isFetching } = useQuery({
    queryKey: [WarehousePrixodQueryKeys.getById, selectedId!],
    queryFn: WarehousePrixodService.getById,
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
        <DialogContent className="relative w-full max-w-9xl h-full max-h-[900px] overflow-hidden">
          {isFetching || isFetchingMainSchet ? <LoadingOverlay /> : null}
          <Printer filename={`${t('pages.material-warehouse')}_${t('prixod')}.pdf`}>
            {({ ref, print }) => (
              <div className="h-full flex flex-col overflow-hidden">
                <DialogHeader className="pb-5">
                  <DialogTitle>
                    {t('pages.material-warehouse')} {t('prixod').toLowerCase()}
                  </DialogTitle>
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
                          value={data.doc_date}
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
                              value={data.contract?.doc_date ?? '-'}
                            />
                            <LabeledValue
                              label={t('shartnoma-grafik')}
                              value={data.contract_grafik?.smeta_number ?? '-'}
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
