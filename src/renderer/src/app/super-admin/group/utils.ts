import { arrayStartsWith, removeTrailingZeros } from '@renderer/common/lib/array'

import type { Group } from '@renderer/common/models'

type TreeNode = Group & {
  _levels: number[]
  _included?: boolean
  children: TreeNode[]
}

const treeFromArray = (list: (Group & { _included?: boolean })[]) => {
  const normalized = list.map((item) => {
    item._included = false
    return {
      ...item,
      children: [],
      _levels: removeTrailingZeros(item.pod_group).split('.').map(Number)
    }
  })

  const findChildren = (target: TreeNode): TreeNode => {
    const children = normalized.filter((item) => {
      if (
        arrayStartsWith(item._levels, target._levels) &&
        item._levels.length > target._levels.length
      ) {
        item._included = true
        return true
      }
      return false
    })
    return {
      ...target,
      children: children.map(findChildren)
    }
  }

  const heads = normalized.filter((item) => {
    if (item._levels.length === 1) {
      item._included = true
      return true
    }
    return false
  })
  const tree = heads.map(findChildren)

  tree.push(...normalized.filter((item) => !item._included))

  return tree
}

export { treeFromArray }
