import type { DialogTriggerProps } from 'react-aria-components'

import { type FC, useMemo, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { Allotment } from 'allotment'
import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { MainZarplataColumnDefs } from '@/app/jur_5/passport-info/columns'
import { GenericTable, LoadingOverlay } from '@/common/components'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Input } from '@/common/components/ui/input'
import { VacantTree, VacantTreeSearch } from '@/common/features/vacant/ui/vacant-tree'
import { arrayToTreeByRelations, searchTreeNodes } from '@/common/lib/tree/relation-tree'
import { cn } from '@/common/lib/utils'

import { AdminZarplataDashboardService } from './service'

export interface ViewStaffModalProps extends Omit<DialogTriggerProps, 'children'> {
  budjetId: number | null
  regionId: number | null
}
export const ViewStaffModal: FC<ViewStaffModalProps> = ({ budjetId, regionId, ...props }) => {
  const [vacantId, setVacantId] = useState<number | null>(null)
  const [vacantSearch, setVacantSearch] = useState('')

  const [search, setSearch] = useState('')

  const adminVacantsQuery = useQuery({
    queryKey: [
      AdminZarplataDashboardService.QueryKeys.GetVacant,
      {
        budjetId: budjetId!,
        regionId: regionId!
      }
    ],
    queryFn: AdminZarplataDashboardService.getVacant,
    enabled: !!regionId && !!budjetId
  })
  const vacantsData = adminVacantsQuery.data ?? []

  const adminMainZarplataDocsQuery = useQuery({
    queryKey: [
      AdminZarplataDashboardService.QueryKeys.GetMainZarplata,
      {
        regionId: regionId!,
        vacantId: vacantId!
      }
    ],
    queryFn: AdminZarplataDashboardService.getMainZarplata,
    enabled: !!regionId && !!vacantId
  })
  const mainZarplataData = adminMainZarplataDocsQuery.data ?? []

  const { t } = useTranslation()

  const treeNodes = useMemo(
    () =>
      arrayToTreeByRelations({
        array: vacantsData,
        getId: (node) => node.id,
        getParentId: (node) => node.parentId
      }),
    [vacantsData]
  )
  const filteredTreeNodes = useMemo(() => {
    return vacantSearch ? searchTreeNodes(treeNodes, vacantSearch, (item) => item.name) : treeNodes
  }, [vacantSearch, treeNodes])

  const filteredMainZarplata = mainZarplataData.filter((item) => {
    if (!search) return true
    return item.fio.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <>
      <DialogTrigger {...props}>
        <DialogOverlay>
          <DialogContent className="w-full max-w-full h-full p-0">
            <div className="h-full flex flex-col overflow-hidden">
              <DialogHeader className="p-5">
                <DialogTitle>{t('vacant')}</DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-hidden">
                <Allotment className="h-full">
                  <Allotment.Pane
                    preferredSize={300}
                    maxSize={600}
                    minSize={300}
                    className="w-full bg-gray-50"
                  >
                    <div className="h-full flex flex-col">
                      {adminVacantsQuery.isFetching ? <LoadingOverlay /> : null}
                      <VacantTreeSearch
                        search={vacantSearch}
                        onValueChange={setVacantSearch}
                        treeNodes={filteredTreeNodes}
                      />
                      <div className="flex-1 overflow-y-auto scrollbar">
                        <VacantTree
                          nodes={filteredTreeNodes}
                          selectedIds={vacantId ? [vacantId] : []}
                          onSelectNode={(node) => setVacantId(node.id)}
                        />
                      </div>
                    </div>
                  </Allotment.Pane>
                  <Allotment.Pane>
                    <div className="h-full flex flex-col pl-px">
                      <div className="px-5 py-2 flex items-center">
                        <div className="relative w-full max-w-xs">
                          <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={cn('h-8', search && 'bg-brand/10')}
                          />
                          <Search className="absolute right-0.5 top-1.5 btn-icon icon-start text-gray-600/40" />
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto scrollbar">
                        {adminMainZarplataDocsQuery.isFetching ? <LoadingOverlay /> : null}
                        <GenericTable
                          columnDefs={MainZarplataColumnDefs}
                          data={filteredMainZarplata}
                          className="table-generic-xs"
                        />
                      </div>
                    </div>
                  </Allotment.Pane>
                </Allotment>
                {adminVacantsQuery.isFetching ? <LoadingOverlay /> : null}
              </div>
            </div>
          </DialogContent>
        </DialogOverlay>
      </DialogTrigger>
    </>
  )
}
