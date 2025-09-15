import type { MainZarplata } from '@/common/models'

import { useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Allotment } from 'allotment'
import { Calculator } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { SelectedVacantsFilter } from '@/app/jur_5/common/components/selected-vacants-filter'
import { MainZarplataTable } from '@/app/jur_5/common/features/main-zarplata/main-zarplata-table'
import { useVacantFilters } from '@/app/jur_5/common/hooks/use-selected-vacant-filters'
import { LoadingOverlay } from '@/common/components'
import { Button } from '@/common/components/jolly/button'
import { Checkbox } from '@/common/components/jolly/checkbox'
import { Badge } from '@/common/components/ui/badge'
import { Label } from '@/common/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/common/components/ui/tabs'

import { MainZarplataService } from '../main-zarplata/service'
import { PayrollDeductionService } from '../payroll-deduction/service'
import { PayrollPaymentService } from '../payroll-payment/service'
import { useVacantTreeNodes } from '../vacant/hooks/use-vacant-tree-nodes'
import { VacantTree, type VacantTreeNode, VacantTreeSearch } from '../vacant/ui/vacant-tree'

enum TabOptions {
  ALL = 'all',
  SELECTED = 'selected'
}

export const CalculateEmployeeSalaries = () => {
  const [activeTab, setActiveTab] = useState(TabOptions.ALL)
  const [visibleVacant, setVisibleVacant] = useState<number | null>(null)

  const [selectedVacant, setSelectedVacant] = useState<VacantTreeNode | null>(null)
  const [selectedMainZarplata, setSelectedMainZarplata] = useState<MainZarplata[]>([])

  const { t } = useTranslation()

  const { treeNodes, filteredTreeNodes, search, setSearch, vacantsQuery } = useVacantTreeNodes()

  const queryClient = useQueryClient()

  const mainZarplataQuery = useQuery({
    queryKey: [
      MainZarplataService.QueryKeys.GetByVacantId,
      {
        vacantId: selectedVacant?.id ?? 0,
        ostanovit: false
      }
    ],
    queryFn: MainZarplataService.getByVacantId,
    enabled: !!selectedVacant
  })

  const calculateSalaryByIdsMutation = useMutation({
    mutationFn: MainZarplataService.calculateSalaryById,
    onSuccess: () => {
      toast.success(t('update_successful'))
      queryClient.invalidateQueries({
        queryKey: [PayrollPaymentService.QueryKeys.GetAll]
      })
      queryClient.invalidateQueries({
        queryKey: [PayrollDeductionService.QueryKeys.GetByMainZarplataId]
      })
    },
    onError: () => {
      toast.error(t('update_failed'))
    }
  })
  const calculateSalaryAllMutation = useMutation({
    mutationFn: MainZarplataService.calculateSalaryAll,
    onSuccess: () => {
      toast.success(t('update_successful'))
      queryClient.invalidateQueries({
        queryKey: [PayrollPaymentService.QueryKeys.GetAll]
      })
      queryClient.invalidateQueries({
        queryKey: [PayrollDeductionService.QueryKeys.GetByMainZarplataId]
      })
    },
    onError: () => {
      toast.error(t('update_failed'))
    }
  })

  const handleCalculateSalaryAll = () => {
    calculateSalaryAllMutation.mutate()
  }
  const handleCalculateSalaryById = () => {
    calculateSalaryByIdsMutation.mutate(
      selectedMainZarplata.map((mainZarplata) => ({ mainZarplataId: mainZarplata.id }))
    )
  }

  const filterOptions = useVacantFilters({
    vacants: treeNodes,
    selectedItems: selectedMainZarplata,
    getItemVacantId: (item) => item.vacantId
  })

  const selectedIds = selectedMainZarplata.map((mainZarplata) => mainZarplata.id)
  const isAllSelected =
    mainZarplataQuery?.data?.every((vacant) =>
      selectedMainZarplata.some((selected) => selected.id === vacant.id)
    ) ?? false

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedMainZarplata((prev) =>
        prev.filter((m) => !mainZarplataQuery?.data?.some((vacant) => vacant.id === m.id))
      )
    } else {
      setSelectedMainZarplata((prev) => {
        const newSelected =
          mainZarplataQuery?.data?.filter((vacant) => !prev.some((m) => m.id === vacant.id)) ?? []
        return [...prev, ...newSelected]
      })
    }
  }

  return (
    <Allotment
      proportionalLayout={false}
      defaultSizes={[300, 0]}
      className="h-full"
    >
      <Allotment.Pane
        preferredSize={300}
        maxSize={600}
        minSize={300}
        className="w-full bg-gray-50"
      >
        <div className="relative h-full flex flex-col">
          {vacantsQuery.isPending ? <LoadingOverlay /> : null}
          <VacantTreeSearch
            search={search}
            onValueChange={setSearch}
            treeNodes={filteredTreeNodes}
          />
          <div className="relative overflow-auto scrollbar flex-1">
            <VacantTree
              nodes={filteredTreeNodes}
              selectedIds={selectedVacant ? [selectedVacant.id] : []}
              onSelectNode={setSelectedVacant}
            />
          </div>
        </div>
      </Allotment.Pane>
      <Allotment.Pane>
        <div className="h-full flex flex-col">
          <div className="p-2.5">
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as TabOptions)}
            >
              <TabsList>
                <TabsTrigger value={TabOptions.ALL}>{t('select')}</TabsTrigger>
                <TabsTrigger value={TabOptions.SELECTED}>
                  {t('selected')}
                  <Badge className="-m-2 ml-2">{selectedMainZarplata.length}</Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {activeTab === TabOptions.SELECTED && (
            <div className="px-2.5 pb-2.5">
              <SelectedVacantsFilter
                selectedVacants={filterOptions}
                selectedCount={selectedMainZarplata.length ?? 0}
                visibleVacant={visibleVacant}
                setVisibleVacant={setVisibleVacant}
              />
            </div>
          )}

          {activeTab === TabOptions.ALL ? (
            <div className="flex-1 min-h-0 overflow-hidden flex flex-col gap-2">
              <div className="px-2.5 flex items-center gap-2">
                <Checkbox
                  id="select-all"
                  isSelected={isAllSelected}
                  isIndeterminate={
                    !isAllSelected &&
                    !!mainZarplataQuery.data?.some((m) => selectedIds.includes(m.id))
                  }
                  onChange={handleSelectAll}
                />
                <Label
                  htmlFor="select-all"
                  className="text-xs font-semibold text-gray-600"
                >
                  {t('select_all')}
                </Label>
              </div>
              <div className="relative flex-1 w-full overflow-auto scrollbar pl-px">
                {mainZarplataQuery.isFetching ? <LoadingOverlay /> : null}
                <MainZarplataTable
                  data={mainZarplataQuery.data ?? []}
                  selectedIds={selectedMainZarplata.map((mainZarplata) => mainZarplata.id)}
                  onClickRow={(row) => {
                    setSelectedMainZarplata((prev) => {
                      if (prev.find((p) => p.id === row.id)) {
                        return prev.filter((p) => p.id !== row.id)
                      }
                      return [...prev, row]
                    })
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="relative flex-1 w-full overflow-auto scrollbar pl-px">
              <MainZarplataTable
                data={
                  visibleVacant
                    ? selectedMainZarplata.filter(
                        (mainZarplata) => mainZarplata.vacantId === visibleVacant
                      )
                    : selectedMainZarplata
                }
                onDelete={(row) =>
                  setSelectedMainZarplata((prev) =>
                    prev.filter((mainZarplata) => mainZarplata.id !== row.id)
                  )
                }
              />
            </div>
          )}

          <div className="border-t p-5 pb-2.5 flex items-center justify-end gap-2.5">
            <Button
              isDisabled={selectedMainZarplata.length === 0}
              IconStart={Calculator}
              onPress={handleCalculateSalaryById}
              isPending={calculateSalaryByIdsMutation.isPending}
            >
              {t('calculate')}
            </Button>
            <Button
              IconStart={Calculator}
              onPress={handleCalculateSalaryAll}
              isPending={calculateSalaryAllMutation.isPending}
            >
              {t('calculate_all')}
            </Button>
          </div>
        </div>
      </Allotment.Pane>
    </Allotment>
  )
}
