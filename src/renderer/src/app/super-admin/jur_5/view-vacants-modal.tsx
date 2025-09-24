import type { DialogTriggerProps } from 'react-aria-components'

import { type FC, useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { LoadingOverlay } from '@/common/components'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { VacantTree } from '@/common/features/vacant/ui/vacant-tree'
import { arrayToTreeByRelations } from '@/common/lib/tree/relation-tree'

import { AdminZarplataDashboardService } from './service'

export interface ViewVacantsModalProps extends Omit<DialogTriggerProps, 'children'> {
  budjetId: number | null
  regionId: number | null
}
export const ViewVacantsModal: FC<ViewVacantsModalProps> = ({ budjetId, regionId, ...props }) => {
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

  const { t } = useTranslation()

  const treeNodes = useMemo(
    () =>
      arrayToTreeByRelations({
        array: adminVacantsQuery?.data ?? [],
        getId: (node) => node.id,
        getParentId: (node) => node.parentId
      }),
    [adminVacantsQuery?.data]
  )

  return (
    <>
      <DialogTrigger {...props}>
        <DialogOverlay>
          <DialogContent className="w-full max-w-screen-2xl min-h-[500px] max-h-full flex flex-col overflow-hidden">
            <DialogHeader>
              <DialogTitle>{t('vacant')}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 max-h-[600px] overflow-y-auto scrollbar">
              {adminVacantsQuery.isFetching ? <LoadingOverlay /> : null}
              <VacantTree
                nodes={treeNodes}
                selectedIds={[]}
                onSelectNode={() => {}}
              />
            </div>
          </DialogContent>
        </DialogOverlay>
      </DialogTrigger>
    </>
  )
}
