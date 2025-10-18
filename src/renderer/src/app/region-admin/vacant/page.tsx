import type { Vacant } from '@/common/models/vacant'

import { useEffect, useMemo, useState } from 'react'

import { CaretDownIcon } from '@radix-ui/react-icons'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { GenericTable, LoadingOverlay } from '@/common/components'
import { Button } from '@/common/components/ui/button'
import { Checkbox } from '@/common/components/ui/checkbox'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/common/components/ui/collapsible'
import { useAuthStore } from '@/common/features/auth'
import { useLayout } from '@/common/layout'
import { type RelationTreeNode, arrayToTreeByRelations } from '@/common/lib/tree/relation-tree'
import { cn } from '@/common/lib/utils'

import { RegionUserService } from '../region-user'
import { RegionUserQueryKeys } from '../region-user/config'
import { columnDefs } from './columns'
import { vacantQueryKeys } from './config'
import { createVacantGrantQuery, getUserVacantIdsQuery, getVacantListQuery } from './service'
import { VacantTree } from './vacant-tree'

type VacantTreeNode = RelationTreeNode<Vacant, number | null>

const VacantPage = () => {
  const userOwnId = useAuthStore((store) => store.user?.id)
  const setLayout = useLayout()

  const [userId, setUserId] = useState<number>()
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const { t } = useTranslation(['app'])

  const { data: users, isFetching: isFetchingUsers } = useQuery({
    queryKey: [
      RegionUserQueryKeys.getAll,
      {
        page: 1,
        limit: 100000
      }
    ],
    queryFn: RegionUserService.getAll
  })

  const { data: userVacants, isFetching: isFetchingUserVacants } = useQuery({
    queryKey: [
      RegionUserQueryKeys.getAll,
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
    queryKey: [vacantQueryKeys.getAll, { userId: userOwnId! }],
    queryFn: getVacantListQuery,
    enabled: !!userId && !!userOwnId
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

  const treeNodes = useMemo(
    () =>
      arrayToTreeByRelations({
        array: vacants?.data ?? [],
        getId: (node) => node.id,
        getParentId: (node) => node.parentId
      }),
    [vacants?.data]
  )

  const handleSelectAll = () => {
    if (!vacants?.data) {
      return
    }
    if (selectedIds.length !== vacants.data.length) {
      setSelectedIds(vacants.data.map((v) => v.id))
      return
    }
    setSelectedIds([])
  }
  const handleSelectNode = (node: VacantTreeNode) => {
    const ids: number[] = []

    const getChildrenIds = (node: VacantTreeNode) => {
      ids.push(node.id)

      node.children.forEach((child) => getChildrenIds(child))
    }

    getChildrenIds(node)

    setSelectedIds((prev) => {
      if (prev.includes(node.id)) {
        return prev.filter((id) => !ids.includes(id) && !node.path.includes(id))
      }
      const newIds = Array.from(new Set([...prev, ...ids]))

      const hasAllChildNodesSelected = (node: VacantTreeNode) => {
        return node.children.every(
          (child) => newIds.includes(child.id) && hasAllChildNodesSelected(child)
        )
      }

      node.parents.forEach((parent) => {
        if (hasAllChildNodesSelected(parent)) {
          newIds.push(parent.id)
        }
      })
      return newIds
    })
  }

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
        {userId && vacants?.data ? (
          <div className="flex-1">
            <div className="flex items-center gap-5 px-5">
              <Checkbox
                checked={
                  selectedIds.length === vacants.data.length
                    ? true
                    : selectedIds.length > 0
                      ? 'indeterminate'
                      : false
                }
                onClick={handleSelectAll}
                className="size-5"
              />
              <div>
                <span>{selectedIds.length} </span>
                {t('selected_elements')}
              </div>
            </div>
            <div className="mt-2">
              <VacantTree
                nodes={treeNodes}
                onSelectNode={handleSelectNode}
                selectedIds={selectedIds}
              />
            </div>
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
              isPending={isPendingGrant}
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

const hasSelectedChildNode = (node: VacantTreeNode, selectedIds: number[]) => {
  return !!node.children.find((child) => {
    return selectedIds.includes(child.id) || hasSelectedChildNode(child, selectedIds)
  })
}

interface TreeNodeProps {
  vacant: VacantTreeNode
  selectedIds: number[]
  onSelect: (node: VacantTreeNode) => void
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
          onSelect(vacant)
        }}
      >
        <Checkbox
          className="size-5"
          checked={
            selectedIds.includes(vacant.id)
              ? true
              : hasSelectedChildNode(vacant, selectedIds)
                ? 'indeterminate'
                : false
          }
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
          onSelect(vacant)
        }}
      >
        <Checkbox
          className="size-5"
          checked={
            selectedIds.includes(vacant.id)
              ? true
              : hasSelectedChildNode(vacant, selectedIds)
                ? 'indeterminate'
                : false
          }
        />
        <h4 className="flex-1">{vacant.name}</h4>
        <CollapsibleTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            onClick={(e) => e.stopPropagation()}
            className="size-6"
          >
            <CaretDownIcon className="btn-icon" />
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
