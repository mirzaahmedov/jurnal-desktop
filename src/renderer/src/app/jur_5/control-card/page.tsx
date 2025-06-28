import type { VacantFormValues } from '@/common/features/vacant/config'

import { useEffect, useMemo, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Edit, Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { VacantTree, type VacantTreeNode } from '@/app/region-admin/vacant/vacant-tree'
import { LoadingOverlay } from '@/common/components'
import { Button } from '@/common/components/jolly/button'
import { useConfirm } from '@/common/features/confirm'
import { VacantService } from '@/common/features/vacant/service'
import { VacantDialog } from '@/common/features/vacant/vacant-dialog'
import { WorkplaceDialog } from '@/common/features/workplace/workplace-dialog'
import { useToggle } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { arrayToTreeByRelations } from '@/common/lib/tree/relation-tree'

const ControlCardPage = () => {
  const [selected, setSelected] = useState<VacantTreeNode>()
  const [vacant, setVacant] = useState<VacantTreeNode>()
  const [parent, setParent] = useState<VacantTreeNode>()

  const vacantDialogToggle = useToggle()
  const workplaceDialogToggle = useToggle()
  const queryClient = useQueryClient()
  const setLayout = useLayout()

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

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

  const handleSubmit = (values: VacantFormValues) => {
    if (vacant) {
      updateVacant({
        id: vacant.id,
        values: {
          name: values.name,
          parentId: values.parentId ?? null
        }
      })
      setVacant(undefined)
    } else if (parent) {
      createVacant({
        name: values.name,
        parentId: parent.id
      })
      setParent(undefined)
    } else {
      createVacant({
        name: values.name,
        parentId: null
      })
    }
  }
  const handleDelete = () => {
    if (selected) {
      confirm({
        onConfirm: () => {
          deleteVacant(selected.id)
          setSelected(undefined)
        }
      })
    }
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
      onCreate: workplaceDialogToggle.open
    })
  }, [setLayout, t, workplaceDialogToggle.open])

  return (
    <div className="flex h-full divide-x">
      <div className="w-full max-w-md divide-y flex flex-col">
        <div className="relative flex-1">
          {isCreating || isUpdating || isDeleting ? <LoadingOverlay /> : null}
          <VacantTree
            data={treeNodes}
            selectedIds={selected ? [selected.id] : []}
            onSelectNode={(vacant) => {
              setSelected(vacant)
            }}
          />
        </div>
        <div className="text-center p-5 flex items-center justify-center flex-wrap gap-2">
          <Button
            size="sm"
            onClick={() => {
              if (selected) {
                setParent(selected)
                setVacant(undefined)
                vacantDialogToggle.open()
              } else {
                setParent(undefined)
                setVacant(undefined)
                vacantDialogToggle.open()
              }
            }}
          >
            <Plus className="btn-icon icon-start" /> {t('add')}
          </Button>

          <Button
            variant="outline"
            size="sm"
            isDisabled={!selected}
            onClick={() => {
              setVacant(selected)
              setParent(undefined)
              vacantDialogToggle.open()
            }}
          >
            <Edit className="btn-icon icon-start" /> {t('edit')}
          </Button>

          <Button
            variant="outline"
            isDisabled={!selected}
            size="sm"
            className="text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="btn-icon icon-start" /> {t('delete')}
          </Button>
        </div>
      </div>
      <div className="flex-1"></div>

      <VacantDialog
        isOpen={vacantDialogToggle.isOpen}
        onOpenChange={vacantDialogToggle.setOpen}
        vacant={vacant}
        onSubmit={handleSubmit}
      />

      <WorkplaceDialog
        isOpen={workplaceDialogToggle.isOpen}
        onOpenChange={workplaceDialogToggle.setOpen}
        selected={undefined}
        onSubmit={(values) => {
          console.log(values)
        }}
      />
    </div>
  )
}
export default ControlCardPage
