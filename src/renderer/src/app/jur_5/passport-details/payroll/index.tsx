import { type FC, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { FooterCell, FooterRow, GenericTable, LoadingOverlay } from '@/common/components'
import { CollapsibleTable } from '@/common/components/collapsible-table'
import { MonthSelect } from '@/common/components/month-select'
import { SummaCell } from '@/common/components/table/renderers/summa'
import { YearSelect } from '@/common/components/year-select'
import { MainZarplataService } from '@/common/features/main-zarplata/service'
import { formatNumber } from '@/common/lib/format'

export interface PayrollProps {
  mainZarplataId: number
}
export const Payroll: FC<PayrollProps> = ({ mainZarplataId }) => {
  const { t } = useTranslation()

  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)

  const nachislenieQuery = useQuery({
    queryKey: [
      MainZarplataService.QueryKeys.GetNachislenies,
      mainZarplataId,
      {
        year,
        month
      }
    ],
    queryFn: MainZarplataService.getNachislenies,
    enabled: !!year && !!month
  })
  const nachislenies = nachislenieQuery.data ?? []

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-5 p-5">
        <YearSelect
          selectedKey={year}
          onSelectionChange={(value) => setYear(value ? Number(value) : new Date().getFullYear())}
        />
        <MonthSelect
          selectedKey={month}
          onSelectionChange={(value) => setMonth(value ? Number(value) : new Date().getMonth() + 1)}
        />
      </div>
      <div className="flex-1 overflow-y-auto scrollbar">
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
