import { type FC, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { FooterCell, FooterRow, GenericTable, LoadingOverlay } from '@/common/components'
import { CollapsibleTable } from '@/common/components/collapsible-table'
import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { Button } from '@/common/components/jolly/button'
import { SummaCell } from '@/common/components/table/renderers/summa'
import { DownloadFile } from '@/common/features/file'
import { MainZarplataService } from '@/common/features/main-zarplata/service'
import { formatDate, getFirstDayOfMonth, getLastDayOfMonth } from '@/common/lib/date'
import { formatLocaleDate, formatNumber } from '@/common/lib/format'

export interface PayrollProps {
  mainZarplataId: number
}
export const Payroll: FC<PayrollProps> = ({ mainZarplataId }) => {
  const { t } = useTranslation()

  const [startDate, setStartDate] = useState(formatDate(getFirstDayOfMonth()))
  const [endDate, setEndDate] = useState(formatDate(getLastDayOfMonth()))

  const from = formatLocaleDate(startDate)
  const to = formatLocaleDate(endDate)

  const nachislenieQuery = useQuery({
    queryKey: [
      MainZarplataService.QueryKeys.GetNachislenies,
      mainZarplataId,
      {
        from,
        to
      }
    ],
    queryFn: MainZarplataService.getNachislenies,
    enabled: !!from && !!to
  })
  const nachislenies = nachislenieQuery.data ?? []

  const handleNextDay = (field: 'from' | 'to', amount: number) => {
    const date = new Date(field === 'from' ? startDate! : endDate!)
    date.setDate(date.getDate() + amount)
    const newDate = date.toISOString().split('T')[0]
    if (field === 'from') setStartDate(newDate)
    else setEndDate(newDate)
  }
  const handlePrevDay = (field: 'from' | 'to', amount: number) => {
    const date = new Date(field === 'from' ? startDate! : endDate!)
    date.setDate(date.getDate() - amount)
    const newDate = date.toISOString().split('T')[0]
    if (field === 'from') setStartDate(newDate)
    else setEndDate(newDate)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-5 p-5">
        <div className="flex items-center justify-between flex-wrap gap-x-1 gap-y-2.5">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onPress={() => handlePrevDay('from', 1)}
          >
            <ChevronLeft className="btn-icon" />
          </Button>
          <JollyDatePicker
            autoFocus
            value={startDate}
            onChange={(date) => setStartDate(date)}
            containerProps={{ className: 'w-36 min-w-36' }}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onPress={() => handleNextDay('from', 1)}
          >
            <ChevronRight className="btn-icon" />
          </Button>
          <b className="mx-0.5">-</b>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onPress={() => handlePrevDay('to', 1)}
          >
            <ChevronLeft className="btn-icon" />
          </Button>
          <JollyDatePicker
            value={endDate}
            onChange={(date) => setEndDate(date)}
            containerProps={{ className: 'w-36 min-w-36' }}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onPress={() => handleNextDay('to', 1)}
          >
            <ChevronRight className="btn-icon" />
          </Button>

          <DownloadFile
            isZarplata
            url="/Excel2/dnejniy-astat"
            fileName={`${t('cash_balance')}.xlsx`}
            buttonText={t('cash_balance')}
            variant="default"
            params={{
              mainZarplataId,
              from,
              to
            }}
          />
        </div>
      </div>
      <div className="relative flex-1 overflow-y-auto scrollbar">
        {nachislenieQuery.isFetching ? <LoadingOverlay /> : null}
        <CollapsibleTable
          data={nachislenies ?? []}
          columnDefs={[
            {
              key: 'docNum',
              header: 'doc_num'
            },
            {
              key: 'docDate',
              header: 'doc_date'
            },
            {
              key: 'year'
            },
            {
              key: 'month'
            },
            {
              key: 'type'
            },
            {
              key: 'nachislenieSum',
              header: 'nachislenie',
              renderCell: (row) => formatNumber(row.nachislenieSum)
            },
            {
              key: 'uderjanieSum',
              header: 'uderjanie',
              renderCell: (row) => formatNumber(row.uderjanieSum)
            },
            {
              key: 'naRukiSum',
              header: 'na_ruki',
              renderCell: (row) => formatNumber(row.naRukiSum)
            }
          ]}
          classNames={{
            header: 'z-100'
          }}
          getRowId={(row) => row.docNum + row.docDate}
          className="table-generic-xs"
        >
          {({ row }) => (
            <div className="relative overflow-hidden py-5 flex flex-col gap-2.5">
              <div className="p-5 rounded-lg border">
                <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
                  <div>
                    <GenericTable
                      data={row?.payments ?? []}
                      columnDefs={[
                        {
                          key: 'name'
                        },
                        {
                          key: 'percentage',
                          header: 'foiz'
                        },
                        {
                          key: 'summa',
                          renderCell: (row) => <SummaCell summa={row.summa} />,
                          numeric: true
                        }
                      ]}
                      className="table-generic-xs border-t border-l"
                      footer={
                        <FooterRow>
                          <FooterCell
                            title={t('total')}
                            colSpan={3}
                          />
                          <FooterCell
                            content={formatNumber(
                              row?.payments?.reduce((result, { summa }) => result + (summa ?? 0), 0)
                            )}
                          />
                        </FooterRow>
                      }
                    />
                  </div>
                  <div>
                    <GenericTable
                      data={row?.deductions ?? []}
                      columnDefs={[
                        {
                          key: 'name'
                        },
                        {
                          key: 'percentage',
                          header: 'foiz'
                        },
                        {
                          key: 'summa',
                          renderCell: (row) => <SummaCell summa={row.summa} />,
                          numeric: true
                        }
                      ]}
                      className="table-generic-xs border-t border-l"
                      footer={
                        <FooterRow>
                          <FooterCell
                            title={t('total')}
                            colSpan={3}
                          />
                          <FooterCell
                            content={formatNumber(
                              row?.deductions?.reduce(
                                (result, { summa }) => result + (summa ?? 0),
                                0
                              )
                            )}
                          />
                        </FooterRow>
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </CollapsibleTable>
      </div>
    </div>
  )
}
