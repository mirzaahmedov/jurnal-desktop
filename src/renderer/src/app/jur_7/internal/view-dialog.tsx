import type { MaterialInternalProvodka } from '@/common/models'

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
import { PDFSaver } from '@/common/components/pdf-saver'
import { Checkbox } from '@/common/components/ui/checkbox'
import { Textarea } from '@/common/components/ui/textarea'
import { ApiEndpoints } from '@/common/features/crud'
import { DownloadFile } from '@/common/features/file'
import { useRequisitesStore } from '@/common/features/requisites'
import { formatLocaleDate, formatNumber } from '@/common/lib/format'
import { numberToWords } from '@/common/lib/utils'

import { TotalsOverview } from '../components/totals-overview'
import { WarehouseInternalQueryKeys } from './config'
import { WarehouseInternalService } from './service'

const provodkaColumns: ColumnDef<MaterialInternalProvodka>[] = [
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
  const { budjet_id, main_schet_id } = useRequisitesStore()

  const { data: rasxod, isFetching } = useQuery({
    queryKey: [WarehouseInternalQueryKeys.getById, selectedId!],
    queryFn: WarehouseInternalService.getById,
    enabled: !!selectedId
  })

  const data = rasxod?.data
  const totals = {
    total: 0,
    _01: 0,
    _06: 0,
    _07: 0,
    iznos: 0
  }
  data?.childs?.forEach((child) => {
    totals.total += child.summa || 0
    if (child.kredit_schet.startsWith('01')) {
      totals._01 += child.summa || 0
    } else if (child.kredit_schet.startsWith('06')) {
      totals._06 += child.summa || 0
    } else if (child.kredit_schet.startsWith('07')) {
      totals._07 += child.summa || 0
    }
    totals.iznos += child.iznos_summa || 0
  })

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
          <PDFSaver
            filename={`${t('pages.material-warehouse')}_${t('internal')}_№${data?.doc_num}.pdf`}
            orientation="landscape"
            format={[350, 260]}
          >
            {({ ref, savePDF, isPending }) => (
              <div
                ref={ref}
                className="h-full flex flex-col overflow-hidden"
              >
                <DialogHeader className="p-5">
                  <DialogTitle>
                    {t('pages.material-warehouse')} {t('internal').toLowerCase()}
                  </DialogTitle>
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
                            value={data.kimdan}
                          />
                          <LabeledValue
                            label={t('podrazdelenie')}
                            value={data.kimdan_podraz_name}
                          />
                        </div>
                      </Fieldset>
                      <Fieldset name={t('to-whom')}>
                        <div className="grid grid-cols-2 gap-5">
                          <LabeledValue
                            label={t('fio')}
                            value={data.kimga}
                          />
                          <LabeledValue
                            label={t('podrazdelenie')}
                            value={data.kimga_podraz_name}
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

                    <div className="p-5">
                      <TotalsOverview
                        total={totals.total}
                        _01={totals._01}
                        _06={totals._06}
                        _07={totals._07}
                        iznos={totals.iznos}
                      />
                    </div>
                  </div>
                ) : null}
                <DialogFooter className="pdf-hidden">
                  <DownloadFile
                    url={`${ApiEndpoints.jur7_internal}/${data?.id}`}
                    fileName={`${t('pages.material-warehouse')}_${t('internal')}_№${data?.doc_num}.xlsx`}
                    buttonText={t('request_release')}
                    params={{
                      budjet_id,
                      main_schet_id,
                      akt: true
                    }}
                  />
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
