import type { VacantFormValues } from '@/common/features/vacant/config'
import type { WorkplaceFormValues } from '@/common/features/workplace/config'
import type { Workplace } from '@/common/models/workplace'

import { useEffect, useMemo, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Edit, Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { VacantTree, type VacantTreeNode } from '@/app/region-admin/vacant/vacant-tree'
import { GenericTable, LoadingOverlay } from '@/common/components'
import { Button } from '@/common/components/jolly/button'
import { useConfirm } from '@/common/features/confirm'
import { VacantService } from '@/common/features/vacant/service'
import { VacantDialog } from '@/common/features/vacant/vacant-dialog'
import { WorkplaceColumns } from '@/common/features/workplace/columns'
import { WorkplaceService } from '@/common/features/workplace/service'
import { WorkplaceDialog } from '@/common/features/workplace/workplace-dialog'
import { useZarplataStore } from '@/common/features/zarplata/store'
import { useToggle } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { arrayToTreeByRelations } from '@/common/lib/tree/relation-tree'

import { CalculateParamsService } from '../calculate-params/service'

const ControlCardPage = () => {
  const [selectedVacant, setSelectedVacant] = useState<VacantTreeNode>()
  const [vacantData, setVacantData] = useState<VacantTreeNode>()
  const [vacantParent, setVacantParent] = useState<VacantTreeNode>()

  const [selectedWorkplace, setSelectedWorkplace] = useState<Workplace>()

  const calculateParamsId = useZarplataStore((store) => store.calculateParamsId)

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

  const { data: vacants } = useQuery({
    queryKey: [VacantService.QueryKeys.GetAll, { page: 1, limit: 100000000000000 }],
    queryFn: VacantService.getAll
  })
  const { mutate: createVacant, isPending: isCreating } = useMutation({
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
  const { mutate: updateVacant, isPending: isUpdating } = useMutation({
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
  const { mutate: deleteVacant, isPending: isDeleting } = useMutation({
    mutationFn: VacantService.delete,
    onSuccess: () => {
      vacantDialogToggle.setOpen(false)

      toast.success(t('delete_success'))
      queryClient.invalidateQueries({
        queryKey: [VacantService.QueryKeys.GetAll]
      })
    },
    onError: () => {
      toast.error(t('delete_failed'))
    }
  })

  const { data: workspaces } = useQuery({
    queryKey: [
      WorkplaceService.QueryKeys.GetAll,
      { page: 1, limit: 100000000000000, vacantId: selectedVacant?.id ?? 0 }
    ],
    queryFn: WorkplaceService.getWorkplaces,
    placeholderData: undefined,
    enabled: !!selectedVacant
  })

  const { mutate: createWorkplace } = useMutation({
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
  const { mutate: updateWorkplace } = useMutation({
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
  const { mutate: deleteWorkplace } = useMutation({
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
    if (vacantData) {
      updateVacant({
        id: vacantData.id,
        values: {
          name: values.name,
          parentId: values.parentId ?? null
        }
      })
      setVacantData(undefined)
    } else if (vacantParent) {
      createVacant({
        name: values.name,
        parentId: vacantParent.id
      })
      setVacantParent(undefined)
    } else {
      createVacant({
        name: values.name,
        parentId: null
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

  const treeNodes = useMemo(
    () =>
      arrayToTreeByRelations({
        array: vacants?.data ?? [],
        getId: (node) => node.id,
        getParentId: (node) => node.parentId
      }),
    [vacants]
  )

  useEffect(() => {
    setLayout({
      title: t('pages.control_card'),
      breadcrumbs: [
        {
          title: t('pages.zarplata')
        }
      ],
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
    <div className="flex h-full divide-x">
      <div className="w-full max-w-md divide-y flex flex-col">
        <div className="relative flex-1">
          {isCreating || isUpdating || isDeleting ? <LoadingOverlay /> : null}
          <VacantTree
            data={treeNodes}
            selectedIds={selectedVacant ? [selectedVacant.id] : []}
            onSelectNode={(vacant) => {
              setSelectedVacant(vacant)
            }}
          />
        </div>
        <div className="text-center p-5 flex items-center justify-center flex-wrap gap-2">
          <Button
            size="sm"
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

          <Button
            variant="outline"
            size="sm"
            isDisabled={!selectedVacant}
            onClick={() => {
              setVacantData(selectedVacant)
              setVacantParent(undefined)
              vacantDialogToggle.open()
            }}
          >
            <Edit className="btn-icon icon-start" /> {t('edit')}
          </Button>

          <Button
            variant="outline"
            isDisabled={!selectedVacant}
            size="sm"
            className="text-destructive"
            onClick={handleDeleteVacant}
          >
            <Trash2 className="btn-icon icon-start" /> {t('delete')}
          </Button>
        </div>
      </div>
      <div className="flex-1">
        <GenericTable
          data={workspaces?.data ?? []}
          columnDefs={WorkplaceColumns}
          onEdit={handleEditWorkplace}
          onDelete={handleDeleteWorkplace}
        />
      </div>

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
    </div>
  )
}
export default ControlCardPage
