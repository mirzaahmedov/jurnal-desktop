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
  nodes: VacantTreeNode[]
  selectedIds: number[]
  onSelectNode: (node: VacantTreeNode) => void
}

export const VacantTree = ({ nodes, selectedIds, onSelectNode }: VacantTreeProps) => {
  return (
    <ul className="divide-y text-sm">
      {nodes?.length ? (
        nodes.map((node, index) => (
          <TreeNode
            key={node.id}
            node={node}
            selectedIds={selectedIds}
            onSelect={onSelectNode}
            nodes={nodes}
            index={index}
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
  index: number
  nodes: VacantTreeNode[]
  node: VacantTreeNode
  selectedIds: number[]
  onSelect: (node: VacantTreeNode) => void
  level?: number
}
const TreeNode = ({ node, nodes, index, selectedIds, onSelect, level = 1 }: TreeNodeProps) => {
  if (!node.children.length) {
    return (
      <li
        className={cn(
          'flex items-center gap-5 py-2.5 px-5 cursor-pointer hover:bg-slate-50',
          level > 1 && 'tree_node',
          index === nodes.length - 1 && 'last_node'
        )}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(node)
        }}
      >
        <Checkbox
          className="size-5"
          checked={
            selectedIds.includes(node.id)
              ? true
              : hasSelectedChildNode(node, selectedIds)
                ? 'indeterminate'
                : false
          }
        />
        {node.name}
      </li>
    )
  }

  return (
    <Collapsible>
      <li
        className={cn(
          'flex items-center gap-5 py-2.5 px-5 cursor-pointer hover:bg-slate-50',
          level > 1 && 'tree_node',
          index === nodes.length - 1 && 'last_node'
        )}
        onClick={(e) => {
          e.preventDefault()
          onSelect(node)
        }}
      >
        <Checkbox
          className="size-5"
          checked={
            selectedIds.includes(node.id)
              ? true
              : hasSelectedChildNode(node, selectedIds)
                ? 'indeterminate'
                : false
          }
        />
        <h4 className="flex-1">{node.name}</h4>
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
        <ul className="divide-y pl-5">
          {node.children.map((child, index) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              selectedIds={selectedIds}
              onSelect={onSelect}
              nodes={node.children}
              index={index}
            />
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}
