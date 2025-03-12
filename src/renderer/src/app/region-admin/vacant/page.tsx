import type { Vacant } from '@renderer/common/models/vacant'

import { useEffect, useMemo, useState } from 'react'

import { GenericTable, LoadingOverlay } from '@renderer/common/components'
import { Button } from '@renderer/common/components/ui/button'
import { Checkbox } from '@renderer/common/components/ui/checkbox'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@renderer/common/components/ui/collapsible'
import { useAuthenticationStore } from '@renderer/common/features/auth'
import { useLayoutStore } from '@renderer/common/features/layout'
import {
  type ReletionTreeNode,
  arrayToTreeByReletions
} from '@renderer/common/lib/tree/relation-tree'
import { cn } from '@renderer/common/lib/utils'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AlertTriangle, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { regionUserService } from '../region-user'
import { regionUserKeys } from '../region-user/constants'
import { columnDefs } from './columns'
import { vacantQueryKeys } from './config'
import { createVacantGrantQuery, getUserVacantIdsQuery, getVacantListQuery } from './service'

const VacantPage = () => {
  const authUserId = useAuthenticationStore((store) => store.user?.id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const [userId, setUserId] = useState<number>()
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const { t } = useTranslation(['app'])

  const { data: users, isFetching: isFetchingUsers } = useQuery({
    queryKey: [
      regionUserKeys.getAll,
      {
        page: 1,
        limit: 100000
      }
    ],
    queryFn: regionUserService.getAll
  })

  const { data: userVacants, isFetching: isFetchingUserVacants } = useQuery({
    queryKey: [
      regionUserKeys.getAll,
      {
        userId: userId!
      }
    ],
    queryFn: getUserVacantIdsQuery,
    enabled: !!userId
  })

  const { mutate: vacantGrant, isPending: isPendingGrant } = useMutation({
    mutationFn: createVacantGrantQuery,
    onSuccess: () => {
      toast.success(t('action-successful'))
    }
  })

  const { data: vacants, isFetching: isFetchingVacants } = useQuery({
    queryKey: [vacantQueryKeys.getAll, { userId: authUserId! }],
    queryFn: getVacantListQuery,
    enabled: !!userId
  })

  useEffect(() => {
    setLayout({
      title: t('pages.vacant'),
      breadcrumbs: [
        {
          title: t('pages.region')
        }
      ]
    })
  }, [t, setLayout])

  useEffect(() => {
    setSelectedIds([])
  }, [userId])
  useEffect(() => {
    setSelectedIds(Array.isArray(userVacants) ? userVacants : [])
  }, [userVacants])

  const vacantsTree = useMemo(
    () =>
      arrayToTreeByReletions({
        array: vacants?.data ?? [],
        getId: (node) => node.id,
        getParentId: (node) => node.parentId
      }),
    [vacants?.data]
  )

  return (
    <div className="grid grid-cols-2 h-full divide-x">
      <div className="relative overflow-y-auto">
        {isFetchingUsers ? <LoadingOverlay /> : null}
        <GenericTable
          columnDefs={columnDefs}
          data={users?.data ?? []}
          selectedIds={userId ? [userId] : []}
          onClickRow={(row) => setUserId(row.id)}
        />
      </div>
      <div className="relative p-5 h-full flex flex-col">
        {isFetchingVacants || isFetchingUserVacants ? <LoadingOverlay /> : null}
        {userId ? (
          <div className="flex-1">
            <div>
              <Checkbox checked="indeterminate" />
            </div>
            <ul className="divide-y">
              {vacantsTree.map((item) => (
                <TreeNode
                  key={item.id}
                  vacant={item}
                  selectedIds={selectedIds}
                  onSelect={(id) => {
                    setSelectedIds((prev) => {
                      if (prev.includes(id)) {
                        return prev.filter((e) => e !== id)
                      }
                      return [...prev, id]
                    })
                  }}
                />
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex flex-col gap-5 items-center justify-center mt-72 flex-1">
            <div className="size-40 grid place-items-center bg-slate-50 rounded-full">
              <AlertTriangle className="size-20 text-slate-500" />
            </div>
            <h4 className="text-base text-gore">{t('first_select_user')}</h4>
          </div>
        )}
        <div className="p-5 border-t flex justify-end">
          {userId ? (
            <Button
              disabled={isPendingGrant}
              loading={isPendingGrant}
              onClick={() => {
                vacantGrant({
                  userId: userId!,
                  ids: selectedIds
                })
              }}
            >
              {t('save')}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

interface TreeNodeProps {
  vacant: ReletionTreeNode<Vacant>
  selectedIds: number[]
  onSelect: (id: number) => void
  level?: number
}
const TreeNode = ({ vacant, selectedIds, onSelect, level = 1 }: TreeNodeProps) => {
  if (!vacant.children.length) {
    return (
      <li
        className={cn(
          'flex items-center gap-5 py-2.5 px-5 cursor-pointer hover:bg-slate-50',
          level > 1 && 'tree_node'
        )}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(vacant.id)
        }}
      >
        <Checkbox
          className="size-5"
          checked={selectedIds.includes(vacant.id)}
        />
        {vacant.name}
      </li>
    )
  }

  return (
    <Collapsible>
      <li
        className={cn(
          'flex items-center gap-5 py-2.5 px-5 cursor-pointer hover:bg-slate-50',
          level > 1 && 'tree_node'
        )}
        onClick={(e) => {
          e.preventDefault()
          onSelect(vacant.id)
        }}
      >
        <Checkbox
          className="size-5"
          checked={selectedIds.includes(vacant.id)}
        />
        <h4 className="flex-1">{vacant.name}</h4>
        <CollapsibleTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            onClick={(e) => e.stopPropagation()}
            className="size-6"
          >
            <Plus className="btn-icon" />
          </Button>
        </CollapsibleTrigger>
      </li>
      <CollapsibleContent>
        <ul className="divide-y pl-10">
          {vacant.children.map((child) => (
            <TreeNode
              key={child.id}
              vacant={child}
              level={level + 1}
              selectedIds={selectedIds}
              onSelect={onSelect}
            />
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default VacantPage
