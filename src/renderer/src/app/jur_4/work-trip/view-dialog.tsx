import type { WorkTripChild } from '@/common/models'

import { useQuery } from '@tanstack/react-query'
import { t } from 'i18next'
import { ArrowRight, Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { MainSchetQueryKeys, MainSchetService } from '@/app/region-spravochnik/main-schet'
import { MinimumWageService } from '@/app/super-admin/spravochnik/minimum-wage/service'
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
import { Input } from '@/common/components/ui/input'
import { Textarea } from '@/common/components/ui/textarea'
import { useRequisitesStore } from '@/common/features/requisites'
import { getWorkdaysInPeriod, parseDate } from '@/common/lib/date'
import { formatLocaleDate, formatNumber } from '@/common/lib/format'
import { numberToWords } from '@/common/lib/utils'

import { WorkTripQueryKeys } from './config'
import { WorkTripService } from './service'

const provodkaColumns: ColumnDef<WorkTripChild>[] = [
  {
    key: 'schet',
    renderCell: (row) => row.schet?.schet ?? ''
  },
  {
    key: 'subschet',
    renderCell: (row) => row.schet?.sub_schet ?? ''
  },
  {
    numeric: true,
    key: 'summa'
  },
  {
    key: 'type',
    renderCell: (row) => t(row.type)
  }
]

export interface WorkTripViewDialogProps {
  selectedId: number | null
  onClose: VoidFunction
}
export const WorkTripViewDialog = ({ selectedId, onClose }: WorkTripViewDialogProps) => {
  const { t, i18n } = useTranslation(['app', 'report'])

  const mainSchetId = useRequisitesStore((store) => store.main_schet_id)

  const mainSchetQuery = useQuery({
    queryKey: [MainSchetQueryKeys.getById, mainSchetId],
    queryFn: MainSchetService.getById
  })
  const workTripQuery = useQuery({
    queryKey: [WorkTripQueryKeys.GetById, selectedId!],
    queryFn: WorkTripService.getById,
    enabled: !!selectedId
  })
  const minimumWageQuery = useQuery({
    queryKey: [MinimumWageService.QueryKeys.GetWage],
    queryFn: MinimumWageService.getWage
  })

  const mainSchet = mainSchetQuery?.data?.data
  const workTrip = workTripQuery?.data?.data
  const minimumWage = minimumWageQuery?.data?.data?.summa ?? 0

  const daysCount =
    workTrip?.from_date && workTrip?.to_date
      ? getWorkdaysInPeriod(parseDate(workTrip.from_date), parseDate(workTrip.to_date)).totalDays
      : 0

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
          {workTripQuery.isFetching || mainSchetQuery.isFetching ? <LoadingOverlay /> : null}
          <PDFSaver filename={`${t('pages.avans')}_№${workTrip?.doc_num}.pdf`}>
            {({ ref, savePDF, isPending }) => (
              <div
                ref={ref}
                className="h-full flex flex-col overflow-hidden"
              >
                <DialogHeader className="p-5 border-b">
                  <DialogTitle>{t('pages.avans')}</DialogTitle>
                </DialogHeader>
                {workTrip ? (
                  <div className="flex-1 divide-y overflow-y-auto scrollbar">
                    <Fieldset name={t('document')}>
                      <div className="grid grid-cols-4 gap-5">
                        <LabeledValue
                          label={t('doc_num')}
                          value={workTrip.doc_num}
                        />
                        <LabeledValue
                          label={t('doc_date')}
                          value={workTrip.doc_date ? formatLocaleDate(workTrip.doc_date) : ''}
                        />
                        <LabeledValue
                          label={t('pages.bhm')}
                          value={formatNumber(minimumWageQuery.data?.data?.summa ?? 0)}
                        />
                      </div>
                    </Fieldset>
                    <div className="grid grid-cols-2 divide-x">
                      <Fieldset name={t('pages.work_trip')}>
                        <div className="grid grid-cols-2 gap-5">
                          <LabeledValue
                            label={t('start_date')}
                            value={formatLocaleDate(workTrip.from_date)}
                          />
                          <LabeledValue
                            label={t('end_date')}
                            value={formatLocaleDate(workTrip.to_date)}
                          />
                        </div>
                      </Fieldset>
                      <Fieldset name={t('podotchet-litso')}>
                        <div className="grid grid-cols-2 gap-5">
                          <LabeledValue
                            label={t('fio')}
                            value={workTrip.worker_name}
                          />
                          <LabeledValue
                            label={t('rayon')}
                            value={workTrip.worker_rayon}
                          />
                        </div>
                      </Fieldset>
                    </div>

                    <div className="grid grid-cols-12 divide-x">
                      <Fieldset
                        name={t('daily_expense')}
                        className="col-span-12 gap-2 md:col-span-6 2xl:col-span-2"
                      >
                        <div className="flex flex-col gap-5">
                          <LabeledValue
                            label={t('summa')}
                            value={formatNumber(workTrip.day_summa ?? 0)}
                          />
                          <LabeledValue
                            label={t('days')}
                            value={formatNumber(daysCount ?? 0, 0)}
                          />
                          <div className="text-xs font-semibold text-slate-500 mt-2 flex flex-col justify-between items-end gap-1">
                            <p>
                              [{t('pages.bhm').toLowerCase()}] * 0.1 * [{t('days').toLowerCase()}]
                            </p>
                            <p>
                              {formatNumber(minimumWage)} * 0.1 * {daysCount}
                            </p>
                          </div>
                        </div>
                      </Fieldset>

                      <Fieldset
                        name={t('road_expense')}
                        className="col-span-12 md:order-1 2xl:order-none md:col-span-12 2xl:col-span-6"
                      >
                        <div className="divide-y">
                          {workTrip.road?.map((road) => (
                            <div
                              key={road.id}
                              className="flex flex-col gap-5 py-2.5"
                            >
                              <div className="w-full flex items-center gap-5">
                                <div className="flex items-center gap-2.5">
                                  <Input
                                    readOnly
                                    value={road.from ?? ''}
                                  />
                                  <ArrowRight className="btn-icon flex-shrink-0" />
                                  <Input
                                    readOnly
                                    value={road.to ?? ''}
                                  />
                                </div>
                                <LabeledValue
                                  label={t('distance')}
                                  value={formatNumber(road.km)}
                                />
                              </div>
                              <div className="w-full flex items-center gap-2.5">
                                <LabeledValue
                                  label={t('road_ticket_number')}
                                  value={road.road_ticket_number || '-'}
                                  className="w-48"
                                />
                                <LabeledValue
                                  label={t('summa')}
                                  value={formatNumber(road.road_summa)}
                                  className="flex-1"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </Fieldset>
                      <Fieldset
                        name={t('hotel_expense')}
                        className="col-span-12 md:col-span-6 2xl:col-span-4"
                      >
                        <div className="divide-y">
                          {workTrip.hotel.map((hotel) => (
                            <div
                              key={hotel.id}
                              className="grid grid-cols-2 gap-5 py-2.5"
                            >
                              <LabeledValue
                                label={t('hotel_number')}
                                value={hotel.hostel_ticket_number}
                              />
                              <LabeledValue
                                label={t('days')}
                                value={hotel.day}
                              />
                              <LabeledValue
                                label={t('day_summa')}
                                value={formatNumber(hotel.day_summa)}
                              />
                              <LabeledValue
                                label={t('summa')}
                                value={formatNumber(hotel.hostel_summa)}
                              />
                            </div>
                          ))}
                        </div>
                      </Fieldset>
                    </div>

                    <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
                      <Fieldset name={t('summa')}>
                        <div className="grid grid-cols-3 gap-5">
                          <LabeledValue
                            label={t('summa')}
                            value={formatNumber(Number(workTrip.summa))}
                          />
                          <LabeledValue
                            className="col-span-2"
                            label={null}
                            value={
                              <Textarea
                                readOnly
                                value={numberToWords(Number(workTrip.summa), i18n.language)}
                                className="font-normal"
                              />
                            }
                          />
                        </div>
                      </Fieldset>
                      <div className="p-5">
                        <LabeledValue
                          label={t('opisanie')}
                          value={
                            <Textarea
                              readOnly
                              value={workTrip.comment ?? ''}
                              className="font-normal"
                            />
                          }
                        />
                      </div>
                    </div>

                    <div className="p-5">
                      <GenericTable
                        columnDefs={provodkaColumns}
                        data={workTrip.childs}
                        className="table-generic-xs"
                      />
                    </div>
                  </div>
                ) : null}
                <DialogFooter className="pdf-hidden border-t pt-5">
                  {mainSchet && workTrip ? (
                    <Button
                      variant="ghost"
                      IconStart={Download}
                      isPending={isPending}
                      onPress={savePDF}
                    >
                      {t('download_as_pdf')}
                    </Button>
                  ) : null}
                </DialogFooter>
              </div>
            )}
          </PDFSaver>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
