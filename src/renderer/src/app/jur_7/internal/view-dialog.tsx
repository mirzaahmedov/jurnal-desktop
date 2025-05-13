import type { WarehouseInternalProvodka } from '@/common/models'

import { useQuery } from '@tanstack/react-query'
import { Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'

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
import { formatLocaleDate, formatNumber } from '@/common/lib/format'
import { numberToWords } from '@/common/lib/utils'

import { WarehouseInternalQueryKeys } from './config'
import { WarehouseInternalService } from './service'

const provodkaColumns: ColumnDef<WarehouseInternalProvodka>[] = [
  {
    key: 'code',
    renderCell: (row) => row.product?.id
  },
  {
    key: 'group_number',
    renderCell: (row) => row.group?.group_number
  },
  {
    key: 'name',
    renderCell: (row) => row.product?.name
  },
  {
    key: 'serial_num',
    header: 'serial-num',
    renderCell: (row) => row.product?.serial_num
  },
  {
    key: 'inventar_num',
    header: 'inventar-num',
    renderCell: (row) => row.product?.inventar_num
  },
  {
    key: 'edin',
    header: 'ei',
    renderCell: (row) => row.product?.edin
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
    key: 'iznos',
    columns: [
      {
        key: 'iznos',
        renderCell: (row) => <Checkbox checked={row.iznos} />
      },
      {
        numeric: true,
        key: 'iznos_summa',
        header: 'summa'
      },
      {
        key: 'iznos_schet',
        header: 'schet'
      },
      {
        key: 'iznos_sub_schet',
        header: 'subschet'
      }
    ]
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
    renderCell: (row) => formatLocaleDate(row.data_pereotsenka)
  }
]

export interface WarehouseInternalViewDialogProps {
  selectedId: number | null
  onClose: VoidFunction
}
export const WarehouseInternalViewDialog = ({
  selectedId,
  onClose
}: WarehouseInternalViewDialogProps) => {
  const { t, i18n } = useTranslation(['app', 'report'])

  const { data: rasxod, isFetching } = useQuery({
    queryKey: [WarehouseInternalQueryKeys.getById, selectedId!],
    queryFn: WarehouseInternalService.getById,
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
        <DialogContent className="relative w-full max-w-full h-full max-h-[900px] overflow-hidden">
          {isFetching ? <LoadingOverlay /> : null}
          <Printer filename={`${t('pages.material-warehouse')}_${t('rasxod')}.pdf`}>
            {({ ref, print }) => (
              <div className="h-full flex flex-col overflow-hidden">
                <DialogHeader className="pb-5">
                  <DialogTitle>
                    {t('pages.material-warehouse')} {t('rasxod').toLowerCase()}
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
                        <LabeledValue
                          label={t('dovernost')}
                          value={data.doverennost}
                          className="col-span-2"
                        />
                      </div>
                    </Fieldset>
                    <div className="grid grid-cols-2 divide-x">
                      <Fieldset name={t('from-who')}>
                        <div className="grid grid-cols-2 gap-5">
                          <LabeledValue
                            label={t('fio')}
                            value={data.kimdan?.fio}
                          />
                          <LabeledValue
                            label={t('podrazdelenie')}
                            value={data.kimdan?.spravochnik_podrazdelenie_jur7_name}
                          />
                        </div>
                      </Fieldset>
                      <Fieldset name={t('to-whom')}>
                        <div className="grid grid-cols-2 gap-5">
                          <LabeledValue
                            label={t('fio')}
                            value={data.kimga?.fio}
                          />
                          <LabeledValue
                            label={t('podrazdelenie')}
                            value={data.kimga?.spravochnik_podrazdelenie_jur7_name}
                          />
                        </div>
                      </Fieldset>
                    </div>

                    <div className="grid grid-cols-2">
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
