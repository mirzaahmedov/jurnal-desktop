import type { Vacant } from '@/common/models/vacant'
import type { FC, HTMLAttributes } from 'react'

import { CaretDownIcon } from '@radix-ui/react-icons'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { EmptyList } from '@/common/components/empty-states'
import { Checkbox } from '@/common/components/jolly/checkbox'
import { Button } from '@/common/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/common/components/ui/collapsible'
import { type RelationTreeNode } from '@/common/lib/tree/relation-tree'
import { cn } from '@/common/lib/utils'

export type VacantTreeNode = RelationTreeNode<Vacant, number | null>

const useVacantTreeViewStore = create(
  persist<{
    nodesState: Record<number, boolean>
    toggleNodeState: (id: number) => void
    setNodeState: (id: number, state: boolean) => void
    resetNodeStates: VoidFunction
  }>(
    (set) => ({
      nodesState: {} as Record<number, boolean>,
      toggleNodeState: (id: number) =>
        set((state) => ({
          nodesState: {
            ...state.nodesState,
            [id]: !state.nodesState[id]
          }
        })),
      setNodeState: (id: number, state: boolean) =>
        set((prev) => ({
          nodesState: {
            ...prev.nodesState,
            [id]: state
          }
        })),
      resetNodeStates: () => set({ nodesState: {} })
    }),
    {
      name: 'vacant-tree-view-state'
    }
  )
)

export interface VacantTreeProps {
  nodes: VacantTreeNode[]
  selectedIds: number[]
  onSelectNode: (node: VacantTreeNode) => void
}

export const VacantTree = ({ nodes, selectedIds, onSelectNode }: VacantTreeProps) => {
  return (
    <ul className="text-xs font-semibold">
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
  const { nodesState, setNodeState } = useVacantTreeViewStore()

  if (!node.children.length) {
    return (
      <li
        onClick={(e) => {
          e.stopPropagation()
          onSelect(node)
        }}
        title={node.name}
      >
        <TreeNodeHeader
          node={node}
          selected={
            selectedIds.includes(node.id)
              ? true
              : hasSelectedChildNode(node, selectedIds)
                ? 'indeterminate'
                : false
          }
          className={cn(
            level > 1 && 'tree_node pl-3 ml-2',
            index === nodes.length - 1 && 'last_node border-b-0'
          )}
        ></TreeNodeHeader>
      </li>
    )
  }

  const isOpen = nodesState[node.id] ?? false
  const handleOpenChange = (open: boolean) => {
    setNodeState(node.id, open)
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={handleOpenChange}
    >
      <li
        onClick={(e) => {
          e.preventDefault()
          onSelect(node)
        }}
        title={node.name}
      >
        <TreeNodeHeader
          node={node}
          selected={
            selectedIds.includes(node.id)
              ? true
              : hasSelectedChildNode(node, selectedIds)
                ? 'indeterminate'
                : false
          }
          className={cn(
            level > 1 && 'tree_node pl-2.5 ml-2.5',
            index === nodes.length - 1 && 'last_node'
          )}
        >
          <CollapsibleTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              onClick={(e) => e.stopPropagation()}
              className="size-5"
            >
              <CaretDownIcon
                className={cn('btn-icon transition-transform', isOpen && 'rotate-180')}
              />
            </Button>
          </CollapsibleTrigger>
        </TreeNodeHeader>
      </li>
      <CollapsibleContent>
        <ul className="ml-4">
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

interface TreeNodeHeaderProps extends HTMLAttributes<HTMLDivElement> {
  node: VacantTreeNode
  selected: boolean | 'indeterminate'
}
const TreeNodeHeader: FC<TreeNodeHeaderProps> = ({
  node,
  selected,
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex items-center gap-2.5 py-2.5 px-4 cursor-pointer hover:bg-slate-50 border-b',
        className
      )}
      {...props}
    >
      <Checkbox
        className="size-4"
        isIndeterminate={selected === 'indeterminate'}
        isSelected={selected !== 'indeterminate' ? selected : undefined}
      />
      <h4 className="flex-1 line-clamp-3">{node.name}</h4>
      {children}
    </div>
  )
}
