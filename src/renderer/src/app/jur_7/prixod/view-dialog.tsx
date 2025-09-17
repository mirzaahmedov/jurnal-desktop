import type { MaterialPrixodProvodka } from '@/common/models'

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
import { useRequisitesStore } from '@/common/features/requisites'
import { useToggle } from '@/common/hooks'
import { formatLocaleDate, formatNumber } from '@/common/lib/format'
import { numberToWords } from '@/common/lib/utils'

import { TotalsOverview } from '../__components__/totals-overview'
import { AktPriyomExcelDialog } from './akt-priyom-excel/dialog'
import { AktPriyomPDFDialog } from './akt-priyom-pdf/dialog'
import { MaterialPrixodQueryKeys } from './config'
import { MaterialPrixodService } from './service'

const provodkaColumns: ColumnDef<MaterialPrixodProvodka>[] = [
  {
    key: 'group_number'
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
    renderCell: (row) => formatLocaleDate(row.data_pereotsenka)
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

  const budjetId = useRequisitesStore((store) => store.budjet_id)
  const mainSchetId = useRequisitesStore((store) => store.main_schet_id)

  const aktPDFToggle = useToggle()
  const aktExcelToggle = useToggle()

  const { data: prixod, isFetching } = useQuery({
    queryKey: [MaterialPrixodQueryKeys.getById, selectedId!],
    queryFn: MaterialPrixodService.getById,
    enabled: !!selectedId
  })

  const data = prixod?.data

  const totals = {
    total: 0,
    _01: 0,
    _06: 0,
    _07: 0,
    iznos: 0
  }
  data?.childs?.forEach((child) => {
    totals.total += child.summa || 0
    if (child.debet_schet.startsWith('01')) {
      totals._01 += child.summa || 0
    } else if (child.debet_schet.startsWith('06')) {
      totals._06 += child.summa || 0
    } else if (child.debet_schet.startsWith('07')) {
      totals._07 += child.summa || 0
    }
    totals.iznos += child.eski_iznos_summa || 0
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
            filename={`${t('pages.material-warehouse')}_${t('prixod')}_№${data?.doc_num}.pdf`}
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
                    {t('pages.material-warehouse')} {t('prixod').toLowerCase()}
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
                          value={data.doverennost ?? '-'}
                          className="col-span-2"
                        />
                      </div>
                    </Fieldset>
                    <div className="grid grid-cols-2 divide-x">
                      <Fieldset name={t('receiver-info')}>
                        {data.organ ? (
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
                        <Fieldset name={t('podotchet-litso')}>
                          <div className="grid grid-cols-2 gap-5">
                            <LabeledValue
                              label={t('fio')}
                              value={data.responsible}
                            />
                            <LabeledValue
                              label={t('podrazdelenie')}
                              value={data.podraz_name}
                            />
                          </div>
                        </Fieldset>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 divide-x">
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
                              data.smeta_number ? `${data.smeta_number} (${data.smeta_name})` : '-'
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
                  <Button
                    variant="ghost"
                    IconStart={Download}
                    onClick={aktPDFToggle.open}
                  >
                    {t('receive_akt')} (PDF)
                  </Button>
                  <Button
                    variant="ghost"
                    IconStart={Download}
                    onClick={aktPDFToggle.open}
                  >
                    {t('receive_akt')} (PDF)
                  </Button>
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

          {data ? (
            <>
              <AktPriyomPDFDialog
                isOpen={aktPDFToggle.isOpen}
                onOpenChange={aktPDFToggle.setOpen}
                docNum={data?.doc_num}
                docDate={data?.doc_date}
                organName={data?.organ?.name ?? ''}
                receiverName={data?.responsible ?? ''}
                note={data?.opisanie ?? ''}
                dovernost={data.doverennost ?? ''}
                products={data.childs}
              />
              <AktPriyomExcelDialog
                isOpen={aktExcelToggle.isOpen}
                onOpenChange={aktExcelToggle.setOpen}
                id={data?.id}
                docNum={data?.doc_num}
                budjetId={budjetId ?? 0}
                mainSchetId={mainSchetId ?? 0}
              />
            </>
          ) : null}
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
