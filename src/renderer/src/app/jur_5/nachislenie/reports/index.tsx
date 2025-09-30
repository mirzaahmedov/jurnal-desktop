import type { Nachislenie } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { type FC, useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { Allotment } from 'allotment'
import { WalletCards } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { GenericTable, LoadingOverlay } from '@/common/components'
import { Button } from '@/common/components/jolly/button'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Pagination } from '@/common/components/pagination'
import { RangeDatePicker } from '@/common/components/range-date-picker'
import { SearchInputDebounced } from '@/common/components/search-input-debounced'
import { IDCell } from '@/common/components/table/renderers/id'
import { SummaCell } from '@/common/components/table/renderers/summa'
import { Badge } from '@/common/components/ui/badge'
import { DownloadFile } from '@/common/features/file'
import { AlimentDeductionService } from '@/common/features/payroll-deduction/aliment-deductions/service'
import { useRequisitesStore } from '@/common/features/requisites'
import { useVacantTreeNodes } from '@/common/features/vacant/hooks/use-vacant-tree-nodes'
import {
  VacantTree,
  type VacantTreeNode,
  VacantTreeSearch
} from '@/common/features/vacant/ui/vacant-tree'
import { usePagination, useToggle } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { formatDate, getFirstDayOfMonth, getLastDayOfMonth } from '@/common/lib/date'
import { formatLocaleDate } from '@/common/lib/format'

import { NachislenieTabs } from '../nachislenie-tabs'
import { NachislenieColumns } from '../nachislenie/columns'
import { NachislenieService } from '../nachislenie/service'

export const NachislenieReports = () => {
  const budjetId = useRequisitesStore((store) => store.budjet_id)
  const setLayout = useLayout()

  const [startDate, setStartDate] = useState(formatDate(getFirstDayOfMonth()))
  const [endDate, setEndDate] = useState(formatDate(getLastDayOfMonth()))

  const { t } = useTranslation(['app'])

  useEffect(() => {
    setLayout({
      title: t('reports'),
      breadcrumbs: [
        {
          title: t('pages.zarplata')
        }
      ],
      content: NachislenieTabs
    })
  }, [t, setLayout])

  const from = formatLocaleDate(startDate)
  const to = formatLocaleDate(endDate)

  const { budjet_id } = useRequisitesStore()
  const { filteredTreeNodes, search, setSearch, vacantsQuery } = useVacantTreeNodes()

  const [selectedVacant, setSelectedVacant] = useState<VacantTreeNode>()
  const [selectedNachislenies, setSelectedNachislenies] = useState<Nachislenie[]>([])
  const [docNum, setDocNum] = useState<string>('')

  const pagination = usePagination()
  const alimonyToggle = useToggle()

  const nachislenieMadeQuery = useQuery({
    queryKey: [
      NachislenieService.QueryKeys.MadeVacants,
      {
        from: formatLocaleDate(startDate),
        to: formatLocaleDate(endDate),
        budjetId: budjet_id!
      }
    ],
    queryFn: NachislenieService.getVacantsMade,
    enabled: !!budjet_id
  })

  const { data: nachislenie, isFetching: isFetchingNachislenie } = useQuery({
    queryKey: [
      NachislenieService.QueryKeys.GetVacantId,
      {
        page: pagination.page,
        limit: pagination.limit,
        budjet_name_id: budjet_id!,
        doc_num: docNum || undefined,
        from: formatLocaleDate(startDate),
        to: formatLocaleDate(endDate),
        vacantId: selectedVacant?.id ?? 0
      }
    ],
    queryFn: NachislenieService.getAll,
    enabled: !!budjet_id && !!selectedVacant
  })

  return (
    <div className="h-full flex flex-col">
      <div className="p-2.5 border-b">
        <div className="px-5 py-5 bg-neutral-100 border border-slate-200 rounded-lg">
          <div className="flex items-center justify-between flex-wrap gap-5">
            <RangeDatePicker
              from={startDate}
              to={endDate}
              onValueChange={(from, to) => {
                setStartDate(from)
                setEndDate(to)
              }}
            />

            <div className="flex items-center flex-wrap justify-end gap-2.5">
              <Button
                onPress={() => alimonyToggle.open()}
                variant="ghost"
                IconStart={WalletCards}
                className="ml-auto"
              >
                {t('aliment')}
              </Button>
              <DownloadFile
                isZarplata
                url="Excel/inps-otchet"
                params={{
                  spBudnameId: budjetId,
                  from,
                  to
                }}
                fileName={`inps_${startDate}_${endDate}.xlsx`}
                buttonText={t('inps')}
                variant="ghost"
              />
              <DownloadFile
                isZarplata
                url="Excel/podoxod-otchet"
                params={{
                  spBudnameId: budjetId,
                  from,
                  to
                }}
                fileName={`podoxod_${startDate}_${endDate}.xlsx`}
                buttonText={t('podoxod')}
                variant="ghost"
              />
              <DownloadFile
                isZarplata
                url="Excel/plastik-otchet"
                params={{
                  spBudnameId: budjetId,
                  from,
                  to
                }}
                fileName={`plastik_${startDate}_${endDate}.xlsx`}
                buttonText={t('plastik')}
                variant="ghost"
              />
              <DownloadFile
                isZarplata
                url="Excel/jur5-otchet"
                params={{
                  spBudnameId: budjetId,
                  from,
                  to
                }}
                fileName={`${t('monthly_report')}_${startDate}_${endDate}.xlsx`}
                buttonText={t('monthly_report')}
                variant="ghost"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <Allotment
          proportionalLayout={false}
          defaultSizes={[300, 0]}
          className="h-full"
        >
          <Allotment.Pane
            preferredSize={300}
            maxSize={600}
            minSize={300}
            className="bg-gray-50"
          >
            <div className="h-full flex flex-col">
              {vacantsQuery.isPending ? <LoadingOverlay /> : null}
              <VacantTreeSearch
                search={search}
                onValueChange={setSearch}
                treeNodes={filteredTreeNodes}
              />
              <div className="flex-1 overflow-y-auto scrollbar">
                <VacantTree
                  nodes={filteredTreeNodes}
                  onSelectNode={setSelectedVacant}
                  selectedIds={selectedVacant ? [selectedVacant.id] : []}
                  renderNodeExtra={(node) =>
                    nachislenieMadeQuery.data?.vacantId?.includes?.(node.id) ? (
                      <span className="size-2.5 bg-brand rounded-full inline-block absolute right-1 top-1"></span>
                    ) : null
                  }
                />
              </div>
            </div>
          </Allotment.Pane>
          <Allotment.Pane>
            <div className="h-full flex flex-col overflow-hidden pl-px">
              <div className="p-2.5 flex items-center gap-2">
                <SearchInputDebounced
                  value={docNum}
                  onValueChange={setDocNum}
                />

                <div className="ml-auto flex items-center gap-2">
                  <DialogTrigger>
                    <Button variant="ghost">
                      {t('selected_elements')}
                      <Badge className="ml-1">{selectedNachislenies.length}</Badge>
                    </Button>
                    <DialogOverlay>
                      <DialogContent className="w-full max-w-9xl h-full max-h-[700px] overflow-hidden">
                        <div className="h-full flex flex-col gap-5 overflow-hidden">
                          <DialogHeader>
                            <DialogTitle>{t('selected_elements')}</DialogTitle>
                          </DialogHeader>
                          <div className="flex-1 overflow-y-auto scrollbar">
                            <GenericTable
                              data={selectedNachislenies}
                              columnDefs={NachislenieColumns}
                              onDelete={(row) => {
                                setSelectedNachislenies((prev) =>
                                  prev.filter((n) => n.id !== row.id)
                                )
                              }}
                              className="table-generic-xs"
                            />
                          </div>
                        </div>
                      </DialogContent>
                    </DialogOverlay>
                  </DialogTrigger>
                  <DownloadFile
                    isZarplata
                    url={`Excel/plastik-otchet-byMainIds?${selectedNachislenies.map((n) => `mainIds=${n.id}`).join('&')}`}
                    params={{}}
                    fileName={`zarplata_plastiks.xlsx`}
                    buttonText={t('plastik')}
                  />
                </div>
              </div>
              <div className="flex-1 relative w-full overflow-auto scrollbar">
                {isFetchingNachislenie ? <LoadingOverlay /> : null}
                <GenericTable
                  data={nachislenie?.data ?? []}
                  columnDefs={[
                    {
                      key: 'id',
                      header: ' ',
                      renderCell: IDCell
                    },
                    ...NachislenieColumns
                  ]}
                  selectedIds={selectedNachislenies.map((n) => n.id)}
                  onClickRow={(row) => {
                    setSelectedNachislenies((prev) => {
                      const isSelected = prev.find((n) => n.id === row.id)
                      if (isSelected) {
                        return prev.filter((n) => n.id !== row.id)
                      } else {
                        return [...prev, row]
                      }
                    })
                  }}
                  className="table-generic-xs"
                />
              </div>
              <div className="p-5">
                <Pagination
                  {...pagination}
                  count={nachislenie?.meta?.count ?? 0}
                  pageCount={nachislenie?.meta?.pageCount ?? 0}
                />
              </div>
            </div>
          </Allotment.Pane>
        </Allotment>
      </div>

      <AlimonyModal
        from={from}
        to={to}
        budjetId={budjet_id!}
        isOpen={alimonyToggle.isOpen}
        onOpenChange={alimonyToggle.setOpen}
      />
    </div>
  )
}

interface AlimonyModalProps extends Omit<DialogTriggerProps, 'children'> {
  from: string
  to: string
  budjetId: number
}
const AlimonyModal: FC<AlimonyModalProps> = ({ from, to, budjetId, ...props }) => {
  const { t } = useTranslation(['app'])

  const alimentsQuery = useQuery({
    queryKey: [
      AlimentDeductionService.QueryKeys.GetAliments,
      {
        from,
        to,
        spBudnameId: budjetId
      }
    ],
    queryFn: AlimentDeductionService.getAliments
  })

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="w-full max-w-full h-full max-h-[800px]">
          <div className="flex flex-col gap-5">
            <DialogHeader>
              <DialogTitle>{t('aliment')}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto scrollbar">
              {alimentsQuery.isPending ? <LoadingOverlay /> : null}
              <GenericTable
                data={alimentsQuery.data ?? []}
                columnDefs={[
                  {
                    key: 'id',
                    header: ' ',
                    renderCell: IDCell
                  },
                  {
                    key: 'cardNumber',
                    header: t('card_number')
                  },
                  {
                    key: 'docNum',
                    header: t('doc_num')
                  },
                  {
                    key: 'docDate',
                    header: t('doc_date'),
                    renderCell: (row) => formatLocaleDate(row.docDate)
                  },
                  {
                    key: 'deductionName',
                    header: t('deduction')
                  },
                  {
                    key: 'fio',
                    header: t('fio')
                  },
                  {
                    key: 'poluchatelFio',
                    header: t('poluchatel_fio')
                  },
                  {
                    key: 'summa',
                    renderCell: SummaCell
                  },
                  {
                    key: 'percentage'
                  }
                ]}
                className="table-generic-xs"
              />
            </div>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
