import type { KassaRasxodProvodka } from '@/common/models'

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
import { GenerateFile } from '@/common/features/file'
import { useRequisitesStore } from '@/common/features/requisites'
import { formatNumber } from '@/common/lib/format'
import { numberToWords } from '@/common/lib/utils'

import { KassaRasxodQueryKeys } from './config'
import { KassaRasxodService } from './service'
import { KassaRasxodOrderTemplate } from './templates'

const provodkaColumns: ColumnDef<KassaRasxodProvodka>[] = [
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

export interface KassaRasxodViewDialogProps {
  selectedId: number | null
  onClose: VoidFunction
}
export const KassaRasxodViewDialog = ({ selectedId, onClose }: KassaRasxodViewDialogProps) => {
  const { t, i18n } = useTranslation(['app', 'report'])
  const { main_schet_id } = useRequisitesStore()

  const { data: main_schet, isFetching: isFetchingMainSchet } = useQuery({
    queryKey: [MainSchetQueryKeys.getById, main_schet_id],
    queryFn: MainSchetService.getById
  })
  const { data: rasxod, isFetching } = useQuery({
    queryKey: [KassaRasxodQueryKeys.getById, selectedId!],
    queryFn: KassaRasxodService.getById,
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
          <Printer filename={`${t('pages.kassa_rasxod')}.pdf`}>
            {({ ref, print }) => (
              <div className="h-full flex flex-col overflow-hidden">
                <DialogHeader className="pb-5">
                  <DialogTitle>{t('pages.kassa_rasxod')}</DialogTitle>
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
                  {main_schet?.data && data ? (
                    <>
                      <GenerateFile
                        fileName={`${t('kassa_rasxod_order', { ns: 'report' })}-${data.doc_date}.pdf`}
                        buttonText={t('kassa_rasxod_order', { ns: 'report' })}
                      >
                        <KassaRasxodOrderTemplate
                          doc_date={data.doc_date}
                          doc_num={data.doc_num}
                          fio={data.spravochnik_podotchet_litso_name}
                          summa={formatNumber(data.summa ?? 0)}
                          summaWords={numberToWords(data.summa ?? 0, i18n.language)}
                          podvodkaList={data.childs.map(({ summa, operatsii }) => {
                            return {
                              operatsii: operatsii?.name,
                              summa: formatNumber(summa),
                              debet_schet: operatsii?.schet,
                              credit_schet: main_schet?.data?.jur1_schet ?? ''
                            }
                          })}
                        />
                      </GenerateFile>
                      <Button
                        variant="ghost"
                        IconStart={Download}
                        onPress={print}
                      >
                        {t('download')}
                      </Button>
                    </>
                  ) : null}
                </DialogFooter>
              </div>
            )}
          </Printer>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
