import type { Vacant } from '@/common/models/vacant'

import { CaretDownIcon } from '@radix-ui/react-icons'

import { EmptyList } from '@/common/components/empty-states'
import { Button } from '@/common/components/ui/button'
import { Checkbox } from '@/common/components/ui/checkbox'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/common/components/ui/collapsible'
import { type RelationTreeNode } from '@/common/lib/tree/relation-tree'
import { cn } from '@/common/lib/utils'

export type VacantTreeNode = RelationTreeNode<Vacant, number | null>

export interface VacantTreeProps {
  data: VacantTreeNode[]
  selectedIds: number[]
  onSelectNode: (node: VacantTreeNode) => void
}

export const VacantTree = ({ data, selectedIds, onSelectNode }: VacantTreeProps) => {
  return (
    <ul className="divide-y text-sm">
      {data?.length ? (
        data.map((node) => (
          <TreeNode
            key={node.id}
            vacant={node}
            selectedIds={selectedIds}
            onSelect={onSelectNode}
          />
        ))
      ) : (
        <EmptyList iconProps={{ className: 'w-40' }} />
      )}
    </ul>
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
