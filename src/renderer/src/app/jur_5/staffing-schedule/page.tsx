import type { VacantFormValues } from '@/common/features/vacant/config'
import type { WorkplaceFormValues } from '@/common/features/workplace/config'
import type { Workplace } from '@/common/models/workplace'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Allotment } from 'allotment'
import { Edit, Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { GenericTable, LoadingOverlay } from '@/common/components'
import { Button } from '@/common/components/jolly/button'
import { Pagination } from '@/common/components/pagination'
import { useConfirm } from '@/common/features/confirm'
import {
  SearchFilterDebounced,
  useSearchFilter
} from '@/common/features/filters/search/search-filter-debounced'
import { useRequisitesStore } from '@/common/features/requisites'
import { useRequisitesRedirect } from '@/common/features/requisites/use-main-schet-redirect'
import { useVacantTreeNodes } from '@/common/features/vacant/hooks/use-vacant-tree-nodes'
import { VacantService } from '@/common/features/vacant/service'
import { VacantDialog } from '@/common/features/vacant/ui/vacant-dialog'
import {
  VacantTree,
  type VacantTreeNode,
  VacantTreeSearch
} from '@/common/features/vacant/ui/vacant-tree'
import { WorkplaceColumns } from '@/common/features/workplace/columns'
import { WorkplaceService } from '@/common/features/workplace/service'
import { WorkplaceDialog } from '@/common/features/workplace/workplace-dialog'
import { useZarplataStore } from '@/common/features/zarplata/store'
import { usePagination, useToggle } from '@/common/hooks'
import { useLayout } from '@/common/layout'

import { CalculateParamsService } from '../calculate-params/service'
import { useCalculateParamsGuard } from '../common/hooks/use-calculate-params-guard'
import { WorkplaceDuplicate } from './workplace-duplicate'

const StaffingTable = () => {
  useCalculateParamsGuard()
  useRequisitesRedirect(-1)

  const [selectedVacant, setSelectedVacant] = useState<VacantTreeNode>()
  const [vacantData, setVacantData] = useState<VacantTreeNode>()
  const [vacantParent, setVacantParent] = useState<VacantTreeNode>()

  const [searchFilter] = useSearchFilter()
  const [selectedWorkplace, setSelectedWorkplace] = useState<Workplace>()

  const calculateParamsId = useZarplataStore((store) => store.calculateParamsId)

  const budjetId = useRequisitesStore((store) => store.budjet_id)
  const pagination = usePagination()
  const vacantDialogToggle = useToggle()
  const workplaceDialogToggle = useToggle()
  const queryClient = useQueryClient()
  const setLayout = useLayout()

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const { data: calculateParams } = useQuery({
    queryKey: [CalculateParamsService.QueryKeys.GetById, calculateParamsId],
    queryFn: CalculateParamsService.getCalcParametersById,
    enabled: !!calculateParamsId
  })

  const { filteredTreeNodes, search, setSearch, vacantsQuery } = useVacantTreeNodes()

  const { mutate: createVacant, isPending: isCreatingVacant } = useMutation({
    mutationFn: VacantService.create,
    onSuccess: () => {
      vacantDialogToggle.setOpen(false)

      toast.success(t('create_success'))
      queryClient.invalidateQueries({
        queryKey: [VacantService.QueryKeys.GetAll]
      })
    },
    onError: () => {
      toast.error(t('create_failed'))
    }
  })
  const { mutate: updateVacant, isPending: isUpdatingVacant } = useMutation({
    mutationFn: VacantService.update,
    onSuccess: () => {
      vacantDialogToggle.setOpen(false)

      toast.success(t('update_success'))
      queryClient.invalidateQueries({
        queryKey: [VacantService.QueryKeys.GetAll]
      })
    },
    onError: () => {
      toast.error(t('update_failed'))
    }
  })
  const { mutate: deleteVacant, isPending: isDeletingVacant } = useMutation({
    mutationFn: VacantService.delete,
    onSuccess: () => {
      vacantDialogToggle.setOpen(false)

      toast.success(t('delete_success'))
      queryClient.invalidateQueries({
        queryKey: [VacantService.QueryKeys.GetAll]
      })
    },
    onError: (error) => {
      toast.error(error?.message || t('delete_success'))
    }
  })

  const { data: workplaces, isFetching: isFetchingWorkplaces } = useQuery({
    queryKey: [
      WorkplaceService.QueryKeys.GetAll,
      {
        vacantId: selectedVacant?.id ?? 0,
        page: pagination.page,
        limit: pagination.limit,
        search: searchFilter
      }
    ],
    queryFn: WorkplaceService.getWorkplaces,
    placeholderData: undefined,
    enabled: !!selectedVacant
  })

  const { mutate: createWorkplace, isPending: isCreatingWorkplace } = useMutation({
    mutationFn: WorkplaceService.createWorkplace,
    onSuccess: () => {
      workplaceDialogToggle.setOpen(false)

      toast.success(t('create_success'))
      queryClient.invalidateQueries({
        queryKey: [WorkplaceService.QueryKeys.GetAll]
      })
    },
    onError: () => {
      toast.error(t('create_failed'))
    }
  })
  const { mutate: updateWorkplace, isPending: isUpdatingWorkplace } = useMutation({
    mutationFn: WorkplaceService.updateWorkplace,
    onSuccess: () => {
      workplaceDialogToggle.setOpen(false)

      toast.success(t('update_success'))
      queryClient.invalidateQueries({
        queryKey: [WorkplaceService.QueryKeys.GetAll]
      })
    },
    onError: () => {
      toast.error(t('update_failed'))
    }
  })
  const { mutate: deleteWorkplace, isPending: isDeletingWorkplace } = useMutation({
    mutationFn: WorkplaceService.deleteWorkplace,
    onSuccess: () => {
      workplaceDialogToggle.setOpen(false)

      toast.success(t('delete_success'))
      queryClient.invalidateQueries({
        queryKey: [WorkplaceService.QueryKeys.GetAll]
      })
    },
    onError: () => {
      toast.error(t('delete_failed'))
    }
  })

  const handleSubmitVacant = (values: VacantFormValues) => {
    if (!budjetId) {
      return
    }
    if (vacantData) {
      updateVacant({
        id: vacantData.id,
        values: {
          name: values.name,
          parentId: values.parentId ?? null,
          number: values.number ?? null,
          spravochnikBudjetNameId: values.spravochnikBudjetNameId
        }
      })
      setVacantData(undefined)
    } else if (vacantParent) {
      createVacant({
        name: values.name,
        parentId: vacantParent.id,
        number: values.number ?? null,
        spravochnikBudjetNameId: budjetId
      })
      setVacantParent(undefined)
    } else {
      createVacant({
        name: values.name,
        parentId: null,
        number: values.number ?? null,
        spravochnikBudjetNameId: budjetId
      })
    }
  }
  const handleSubmitWorkplace = (values: WorkplaceFormValues) => {
    if (selectedWorkplace) {
      updateWorkplace({
        id: selectedWorkplace.id,
        values: {
          ...values,
          vacantId: selectedVacant?.id ?? 0
        }
      })
      setSelectedWorkplace(undefined)
    } else {
      createWorkplace({
        ...values,
        vacantId: selectedVacant?.id ?? 0
      })
    }
  }
  const handleDeleteVacant = () => {
    if (selectedVacant) {
      confirm({
        onConfirm: () => {
          deleteVacant(selectedVacant.id)
          setSelectedVacant(undefined)
        }
      })
    }
  }
  const handleEditWorkplace = (workplace: Workplace) => {
    setSelectedWorkplace(workplace)
    workplaceDialogToggle.open()
  }
  const handleDeleteWorkplace = (workplace: Workplace) => {
    confirm({
      onConfirm: () => {
        deleteWorkplace(workplace.id)
        setSelectedWorkplace(undefined)
      }
    })
  }

  useEffect(() => {
    setLayout({
      title: t('pages.staffing_table'),
      breadcrumbs: [
        {
          title: t('pages.zarplata')
        }
      ],
      content: SearchFilterDebounced,
      onCreate:
        selectedVacant && calculateParams
          ? () => {
              workplaceDialogToggle.open()
              setSelectedWorkplace(undefined)
            }
          : undefined
    })
  }, [setLayout, t, workplaceDialogToggle.open, selectedVacant, calculateParams])

  return (
    <>
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
                selectedIds={selectedVacant ? [selectedVacant.id] : []}
                onSelectNode={(vacant) => {
                  setSelectedVacant(vacant)
                }}
              />
            </div>
          </div>
          <div className="text-center p-5 flex items-center justify-center flex-wrap gap-2">
            <Button
              isPending={isCreatingVacant}
              isDisabled={isCreatingVacant}
              onClick={() => {
                if (selectedVacant) {
                  setVacantParent(selectedVacant)
                  setVacantData(undefined)
                  vacantDialogToggle.open()
                } else {
                  setVacantParent(undefined)
                  setVacantData(undefined)
                  vacantDialogToggle.open()
                }
              }}
            >
              <Plus className="btn-icon icon-start" /> {t('add')}
            </Button>

            <div className="flex-1"></div>

            <Button
              variant="ghost"
              size="icon"
              isDisabled={!selectedVacant || isUpdatingVacant}
              isPending={isUpdatingVacant}
              onClick={() => {
                setVacantData(selectedVacant)
                setVacantParent(undefined)
                vacantDialogToggle.open()
              }}
            >
              <Edit className="btn-icon" />
            </Button>

            <Button
              variant="ghost"
              isDisabled={!selectedVacant || isDeletingVacant}
              isPending={isDeletingVacant}
              size="icon"
              onClick={handleDeleteVacant}
            >
              <Trash2 className="btn-icon text-destructive" />
            </Button>
          </div>
        </Allotment.Pane>
        <Allotment.Pane>
          <div className="ml-px h-full flex flex-col">
            <div className="relative flex-1 w-full overflow-auto scrollbar">
              {isFetchingWorkplaces ||
              isCreatingWorkplace ||
              isUpdatingWorkplace ||
              isDeletingWorkplace ? (
                <LoadingOverlay />
              ) : null}
              <GenericTable
                data={workplaces?.data ?? []}
                columnDefs={WorkplaceColumns}
                onEdit={handleEditWorkplace}
                onDelete={handleDeleteWorkplace}
                actions={(row) => <WorkplaceDuplicate values={row} />}
                className="table-generic-xs"
              />
            </div>
            <div className="p-5">
              <Pagination
                {...pagination}
                count={workplaces?.meta?.count ?? 0}
                pageCount={workplaces?.meta?.pageCount ?? 0}
              />
            </div>
          </div>
        </Allotment.Pane>
      </Allotment>
      <VacantDialog
        isOpen={vacantDialogToggle.isOpen}
        onOpenChange={vacantDialogToggle.setOpen}
        vacant={vacantData}
        onSubmit={handleSubmitVacant}
      />

      <WorkplaceDialog
        vacant={selectedVacant}
        isOpen={workplaceDialogToggle.isOpen}
        onOpenChange={workplaceDialogToggle.setOpen}
        selected={selectedWorkplace}
        minimumWage={calculateParams?.minZar ?? 0}
        onSubmit={handleSubmitWorkplace}
      />
    </>
  )
}
export default StaffingTable
