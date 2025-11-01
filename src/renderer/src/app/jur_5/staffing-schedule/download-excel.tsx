import type { DialogTriggerProps } from 'react-aria-components'

import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { Allotment } from 'allotment'
import { useTranslation } from 'react-i18next'

import { VacantTree } from '@/app/region-admin/vacant/vacant-tree'
import { GenericTable, LoadingOverlay, useTableSort } from '@/common/components'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Pagination } from '@/common/components/pagination'
import { DownloadFile } from '@/common/features/file'
import { useVacantTreeNodes } from '@/common/features/vacant/hooks/use-vacant-tree-nodes'
import { type VacantTreeNode, VacantTreeSearch } from '@/common/features/vacant/ui/vacant-tree'
import { WorkplaceColumns } from '@/common/features/workplace/columns'
import { WorkplaceService } from '@/common/features/workplace/service'
import { usePagination } from '@/common/hooks'

export const DownloadExcel = (props: Omit<DialogTriggerProps, 'children'>) => {
  const pagination = usePagination()

  const [selectedVacant, setSelectedVacant] = useState<VacantTreeNode[]>()

  const { filteredTreeNodes, search, setSearch, vacantsQuery } = useVacantTreeNodes()
  const { sorting, getColumnSorted, handleSort } = useTableSort()
  const { t } = useTranslation()

  const { data: workplaces, isFetching: isFetchingWorkplaces } = useQuery({
    queryKey: [
      WorkplaceService.QueryKeys.GetAll,
      {
        vacantId: selectedVacant?.length ? selectedVacant[selectedVacant.length - 1].id : 0,
        page: pagination.page,
        limit: pagination.limit,
        orderBy: sorting?.order_by,
        orderType: sorting?.order_type.toLowerCase() as 'asc' | 'desc' | undefined
      }
    ],
    queryFn: WorkplaceService.getWorkplaces,
    placeholderData: undefined,
    enabled: !!selectedVacant?.length
  })

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="w-full max-w-9xl h-full max-h-[800px]">
          <div className="h-full flex flex-col gap-5">
            <DialogHeader className="flex-row items-center gap-20">
              <DialogTitle>{t('export-excel')}</DialogTitle>

              <p className="text-brand text-sm font-semibold">
                {selectedVacant?.length ? selectedVacant?.[selectedVacant?.length - 1].name : null}
              </p>
            </DialogHeader>
            <Allotment
              proportionalLayout={false}
              defaultSizes={[300, 0]}
              className="h-full"
            >
              <Allotment.Pane
                preferredSize={300}
                maxSize={600}
                minSize={300}
                className="w-full divide-y flex flex-col bg-gray-50"
              >
                <div className="flex-1 min-h-0 flex flex-col">
                  {vacantsQuery.isPending ? <LoadingOverlay /> : null}
                  <VacantTreeSearch
                    search={search}
                    treeNodes={filteredTreeNodes}
                    onValueChange={setSearch}
                  />
                  <div className="relative flex-1 overflow-auto scrollbar">
                    <VacantTree
                      nodes={filteredTreeNodes}
                      selectedIds={selectedVacant?.map((item) => item.id) ?? []}
                      onSelectNode={(vacant) => {
                        setSelectedVacant((prev) => {
                          if (prev?.find((item) => item.id === vacant.id)) {
                            return prev.filter((item) => item.id !== vacant.id)
                          }
                          return [...(prev ?? []), vacant]
                        })
                      }}
                    />
                  </div>
                </div>
              </Allotment.Pane>
              <Allotment.Pane>
                <div className="ml-px h-full flex flex-col">
                  <div className="relative flex-1 w-full overflow-auto scrollbar">
                    {isFetchingWorkplaces ? <LoadingOverlay /> : null}
                    <GenericTable
                      data={workplaces?.data ?? []}
                      columnDefs={WorkplaceColumns}
                      onSort={handleSort}
                      getColumnSorted={getColumnSorted}
                      actionsWidth={200}
                      className="table-generic-xs"
                    />
                  </div>
                  <div className="p-5 flex items-center gap-10 justify-between">
                    <Pagination
                      {...pagination}
                      count={workplaces?.meta?.count ?? 0}
                      pageCount={workplaces?.meta?.pageCount ?? 0}
                    />
                    {selectedVacant?.length ? (
                      <DownloadFile
                        isZarplata
                        url={`Excel2/get-workplace?${selectedVacant?.length ? selectedVacant.map((item) => `vacantId=${item.id}`).join('&') : ''}`}
                        params={{}}
                        fileName={`ish_joylari.xlsx`}
                        buttonText={t('export-excel')}
                      />
                    ) : null}
                  </div>
                </div>
              </Allotment.Pane>
            </Allotment>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
