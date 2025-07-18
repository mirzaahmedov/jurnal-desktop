import type { DialogTriggerProps } from 'react-aria-components'

import { useMemo, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Allotment } from 'allotment'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { VacantTree, type VacantTreeNode } from '@/app/region-admin/vacant/vacant-tree'
import { LoadingOverlay } from '@/common/components'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { VacantService } from '@/common/features/vacant/service'
import { arrayToTreeByRelations } from '@/common/lib/tree/relation-tree'

import { TabelService } from './service'
import { TabelForm } from './tabel-form'

export interface TabelCreateDialogProps extends Omit<DialogTriggerProps, 'children'> {
  budjetId: number
  mainSchetId: number
}
export const TabelCreateDialog = ({ budjetId, mainSchetId, ...props }: TabelCreateDialogProps) => {
  const { t } = useTranslation(['app'])

  const [selectedVacant, setSelectedVacant] = useState<VacantTreeNode | null>(null)

  const queryClient = useQueryClient()

  const { data: vacants, isFetching: isFetchingVacants } = useQuery({
    queryKey: [VacantService.QueryKeys.GetAll, { page: 1, limit: 100000000000000 }],
    queryFn: VacantService.getAll
  })
  const { mutate: createTabel, isPending: isCreating } = useMutation({
    mutationFn: TabelService.create,
    onSuccess: () => {
      toast.success(t('create_success'))
      queryClient.invalidateQueries({
        queryKey: [TabelService.QueryKeys.GetAll]
      })
      props.onOpenChange?.(false)
    },
    onError: () => {
      toast.error(t('create_failed'))
    }
  })

  const treeNodes = useMemo(
    () =>
      arrayToTreeByRelations({
        array: vacants?.data ?? [],
        getId: (node) => node.id,
        getParentId: (node) => node.parentId
      }),
    [vacants]
  )

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="w-full max-w-9xl h-full max-h-[700px] px-0">
          <div className="flex flex-col h-full overflow-hidden gap-5 relative">
            <DialogHeader className="px-5">
              <DialogTitle>{t('tabel')}</DialogTitle>
            </DialogHeader>

            <Allotment className="h-full">
              <Allotment.Pane
                preferredSize={300}
                maxSize={600}
                minSize={200}
                className="w-full bg-gray-50"
              >
                <div className="relative overflow-auto scrollbar h-full">
                  {isFetchingVacants ? <LoadingOverlay /> : null}
                  <VacantTree
                    nodes={treeNodes}
                    selectedIds={selectedVacant ? [selectedVacant.id] : []}
                    onSelectNode={setSelectedVacant}
                  />
                </div>
              </Allotment.Pane>
              <Allotment.Pane>
                <TabelForm
                  budjetId={budjetId}
                  mainSchetId={mainSchetId}
                  onSubmit={createTabel}
                  isPending={isCreating}
                  vacantId={selectedVacant?.id}
                  vacants={treeNodes}
                />
              </Allotment.Pane>
            </Allotment>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
