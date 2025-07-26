import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect, useState } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Allotment } from 'allotment'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { LoadingOverlay } from '@/common/components'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { useVacantTreeNodes } from '@/common/features/vacant/hooks/use-vacant-tree-nodes'
import { VacantTree, type VacantTreeNode } from '@/common/features/vacant/ui/vacant-tree'

import { TabelService } from '../service'
import { TabelCreateForm } from './tabel-create-form'

export interface TabelCreateDialogProps extends Omit<DialogTriggerProps, 'children'> {
  budjetId: number
  mainSchetId: number
  defaultVacant: VacantTreeNode | undefined
}
export const TabelCreateDialog = ({
  budjetId,
  mainSchetId,
  defaultVacant,
  ...props
}: TabelCreateDialogProps) => {
  const { t } = useTranslation(['app'])
  const { treeNodes, vacantsQuery } = useVacantTreeNodes()

  const [selectedVacant, setSelectedVacant] = useState<VacantTreeNode | undefined>(defaultVacant)

  const queryClient = useQueryClient()

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

  useEffect(() => {
    setSelectedVacant(defaultVacant)
  }, [defaultVacant])

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
                  {vacantsQuery.isFetching ? <LoadingOverlay /> : null}
                  <VacantTree
                    nodes={treeNodes}
                    selectedIds={selectedVacant ? [selectedVacant.id] : []}
                    onSelectNode={setSelectedVacant}
                  />
                </div>
              </Allotment.Pane>
              <Allotment.Pane>
                <TabelCreateForm
                  budjetId={budjetId}
                  mainSchetId={mainSchetId}
                  onSubmit={createTabel}
                  isPending={isCreating}
                  vacant={selectedVacant}
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
